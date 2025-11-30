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
            string appName = System.Environment.GetEnvironmentVariable("APP_NAME") ?? throw new ArgumentNullException("APP_NAME");
            string regionAws = System.Environment.GetEnvironmentVariable("REGION_AWS") ?? throw new ArgumentNullException("REGION_AWS");

            string certificateArn = System.Environment.GetEnvironmentVariable("CERTIFICATE_ARN") ?? throw new ArgumentNullException("CERTIFICATE_ARN");
            string domainName = System.Environment.GetEnvironmentVariable("DOMAIN_NAME") ?? throw new ArgumentNullException("DOMAIN_NAME");
            string buildDirectory = System.Environment.GetEnvironmentVariable("BUILD_DIR") ?? throw new ArgumentNullException("BUILD_DIR");
            string rootObject = System.Environment.GetEnvironmentVariable("ROOT_OBJECT") ?? throw new ArgumentNullException("ROOT_OBJECT");
            string subdomainName = System.Environment.GetEnvironmentVariable("SUBDOMAIN_NAME") ?? throw new ArgumentNullException("SUBDOMAIN_NAME");

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
                }
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
        }
    }
}
