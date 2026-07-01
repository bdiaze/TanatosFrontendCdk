using Amazon.CDK;
using Amazon.CDK.AWS.CertificateManager;
using Amazon.CDK.AWS.CloudFront;
using Amazon.CDK.AWS.CloudFront.Origins;
using Amazon.CDK.AWS.Route53;
using Amazon.CDK.AWS.Route53.Targets;
using Amazon.CDK.AWS.S3;
using Amazon.CDK.AWS.S3.Deployment;
using Constructs;
using System;

namespace Cdk
{
    public class CdkStack : Stack
    {
        internal CdkStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            string appName = System.Environment.GetEnvironmentVariable("APP_NAME") ?? throw new InvalidOperationException("No se ha configurado la variable de entorno APP_NAME");
            
            string certificateArn = System.Environment.GetEnvironmentVariable("CERTIFICATE_ARN") ?? throw new InvalidOperationException("No se ha configurado la variable de entorno CERTIFICATE_ARN");
            string domainName = System.Environment.GetEnvironmentVariable("DOMAIN_NAME") ?? throw new InvalidOperationException("No se ha configurado la variable de entorno DOMAIN_NAME");
            string buildDirectory = System.Environment.GetEnvironmentVariable("BUILD_DIR") ?? throw new InvalidOperationException("No se ha configurado la variable de entorno BUILD_DIR");
            string rootObject = System.Environment.GetEnvironmentVariable("ROOT_OBJECT") ?? throw new InvalidOperationException("No se ha configurado la variable de entorno ROOT_OBJECT");
            string subdomainName = System.Environment.GetEnvironmentVariable("SUBDOMAIN_NAME") ?? throw new InvalidOperationException("No se ha configurado la variable de entorno SUBDOMAIN_NAME");
            
            // Se obtiene el certificado existente...
            ICertificate certificate = Certificate.FromCertificateArn(this, $"{appName}FrontendCertificate", certificateArn);

            // Se obtiene el hosted zone existente...
            IHostedZone hostedZone = HostedZone.FromLookup(this, $"{appName}FrontendHostedZone", new HostedZoneProviderProps {
                DomainName = domainName,
            });

            // Se crea bucket donde se almacenará aplicación frontend...  
            Bucket bucket = new(this, $"{appName}FrontendS3Bucket", new BucketProps {
                BucketName = $"{appName.ToLower()}-frontend",
                Versioned = false,
                RemovalPolicy = RemovalPolicy.DESTROY,
                BlockPublicAccess = BlockPublicAccess.BLOCK_ALL,
            });

            Function spaRewriteFunction = new(this, $"{appName}FrontendSpaRewriteFunction", new FunctionProps {
                FunctionName = $"{appName}FrontendSpaRewriteFunction",
                Comment = "Reescribe rutas Angular SPA a /index.html antes de consultar caché",
                Runtime = FunctionRuntime.JS_2_0,
                Code = FunctionCode.FromInline(@"
                    function handler(event) {
                        var uri = event.request.uri;
                        if (uri.match(/\.[a-zA-Z0-9]+$/)) {
                            return event.request;
                        }
                        event.request.uri = '/index.html';
                        return event.request;
                    }
                ")
            });

            // Se crea distribución de cloudfront...
            Distribution distribution = new(this, $"{appName}FrontendDistribution", new DistributionProps {
                Comment = $"{appName} Frontend Distribution",
                DefaultRootObject = rootObject,
                DomainNames = [subdomainName],
                Certificate = certificate,
                DefaultBehavior = new BehaviorOptions {
                    Origin = S3BucketOrigin.WithOriginAccessControl(bucket),
                    Compress = true,
                    AllowedMethods = AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                    ViewerProtocolPolicy = ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    ResponseHeadersPolicy = ResponseHeadersPolicy.SECURITY_HEADERS,
                    FunctionAssociations = [
                        new FunctionAssociation {
                            Function = spaRewriteFunction,
                            EventType = FunctionEventType.VIEWER_REQUEST
                        }
                    ]
                },
                ErrorResponses = [
                    new ErrorResponse {
                        HttpStatus = 403,
                        ResponseHttpStatus = 200,
                        ResponsePagePath = $"/{rootObject}",
                        Ttl = Duration.Days(1),
                    },
                    new ErrorResponse {
                        HttpStatus = 404,
                        ResponseHttpStatus = 200,
                        ResponsePagePath = $"/{rootObject}",
                        Ttl = Duration.Days(1),
                    },
                ]
            });

            // Se despliegan piezas del frontend en el bucket...
            _ = new BucketDeployment(this, $"{appName}FrontendDeployment", new BucketDeploymentProps {
                Sources = [Source.Asset(buildDirectory)],
                DestinationBucket = bucket,
                Distribution = distribution,
            });

            // Se crea record en hosted zone...
            _ = new ARecord(this, $"{appName}FrontendARecord", new ARecordProps {
                Zone = hostedZone,
                RecordName = subdomainName,
                Target = RecordTarget.FromAlias(new CloudFrontTarget(distribution)),
            });

            _ = new AaaaRecord(this, $"{appName}FrontendAAAARecord", new AaaaRecordProps {
                Zone = hostedZone,
                RecordName = subdomainName,
                Target = RecordTarget.FromAlias(new CloudFrontTarget(distribution)),
            });

            #region Redirección de URL a versión www.
            // Función para redireccionar request a versión www. de la página web...
            Function redirectFunction = new(this, $"{appName}FrontendRedirectFunction", new FunctionProps {
                FunctionName = $"{appName}FrontendRedirectFunction",
                Comment = "Redirecciona al usuario a la versión www.* de la página web",
                Runtime = FunctionRuntime.JS_2_0,
                Code = FunctionCode.FromInline($@"
                    function handler(event) {{
                        var request = event.request;
                        var url = 'https://{subdomainName}' + request.uri;
                      
                        if (request.querystring && Object.keys(request.querystring).length > 0) {{
                            var qs = [];
                            for (var key in request.querystring) {{
                                var qsParam = request.querystring[key];
                                if (qsParam.multiValue) {{
                                    qsParam.multiValue.forEach(function(item) {{
                                        qs.push(key + '=' + item.value);
                                    }});
                                }} else {{
                                    qs.push(key + '=' + qsParam.value);
                                }}
                            }}
                            url += '?' + qs.join('&');
                        }}

                        return {{
                            statusCode: 301,
                            statusDescription: 'Moved Permanently',
                            headers: {{
                                location: {{
                                    value: url
                                }}
                            }}
                        }};
                    }}
                ")
            });

            Bucket bucketDummy = new(this, $"{appName}FrontendRedirectS3Bucket", new BucketProps {
                BucketName = $"{appName.ToLower()}-frontend-redirect-bucket",
                Versioned = false,
                RemovalPolicy = RemovalPolicy.DESTROY,
                AutoDeleteObjects = true,
                BlockPublicAccess = BlockPublicAccess.BLOCK_ALL,
            });

            // Se añade distribución para redireccionar request a versión www. de la página web...
            Distribution redirectDistribution = new(this, $"{appName}FrontendRedirectDistribution", new DistributionProps {
                Comment = $"{appName} Frontend Redirect Distribution",
                DomainNames = [domainName],
                Certificate = certificate,
                DefaultBehavior = new BehaviorOptions {
                    Origin = S3BucketOrigin.WithOriginAccessControl(bucketDummy),
                    Compress = true,
                    AllowedMethods = AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                    ViewerProtocolPolicy = ViewerProtocolPolicy.ALLOW_ALL,
                    ResponseHeadersPolicy = ResponseHeadersPolicy.SECURITY_HEADERS,
                    FunctionAssociations = [
                        new FunctionAssociation {
                            Function = redirectFunction,
                            EventType = FunctionEventType.VIEWER_REQUEST
                        }
                    ]
                },
            });

            // Se crea record en hosted zone...
            _ = new ARecord(this, $"{appName}FrontendRedirectARecord", new ARecordProps {
                Zone = hostedZone,
                RecordName = domainName,
                Target = RecordTarget.FromAlias(new CloudFrontTarget(redirectDistribution)),
            });

            _ = new AaaaRecord(this, $"{appName}FrontendRedirectAAAARecord", new AaaaRecordProps {
                Zone = hostedZone,
                RecordName = domainName,
                Target = RecordTarget.FromAlias(new CloudFrontTarget(redirectDistribution)),
            });
            #endregion
        }
    }
}
