import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { ModeloCanvasDao } from '@/app/daos/modelo-canvas-dao';
import { EntModeloCanvasActualizar } from '@/app/entities/others/ent-modelo-canvas-actualizar';
import { EntModeloCanvasCrear } from '@/app/entities/others/ent-modelo-canvas-crear';
import { SalModeloCanvas } from '@/app/entities/others/sal-modelo-canvas';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCirclePlus, lucideHandCoins, lucideLayers, lucidePlug, lucidePlus, lucideTrash, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';

@Component({
    selector: 'app-mantenedor-modelos-canvas',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        HlmButtonImports,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmSpinnerImports,
        HlmH3,
        HlmH4,
        HlmSeparatorImports,
        HlmSkeletonImports,
        HlmBreadcrumbImports,
        HlmItemImports,
        NgClass,
        DatePipe,
    ],
    templateUrl: './mantenedor-modelos-canvas.html',
    styleUrl: './mantenedor-modelos-canvas.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideLayers,
            lucidePlus,
            lucideTrash,
        }),
        DatePipe,
    ],
})
export class MantenedorModelosCanvas {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);
    private readonly modelosCanvasDao = inject(ModeloCanvasDao);
    negocioStore = inject(NegocioStore);
    private readonly datePipe = inject(DatePipe);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    camposEdicion = computed<CampoDinamico[]>(() => {
        const campoModalEditar = this.campoModalEditar();

        let nombre: string;
        switch (campoModalEditar!.tipo) {
            case 'socios-clave':
                nombre = 'Socios Clave';
                break;
            case 'actividades-clave':
                nombre = 'Actividades Clave';
                break;
            case 'recursos-clave':
                nombre = 'Recursos Clave';
                break;
            case 'propuesta-valor':
                nombre = 'Propuesta de Valor';
                break;
            case 'relaciones-clientes':
                nombre = 'Relación con Clientes';
                break;
            case 'canales':
                nombre = 'Canales';
                break;
            case 'segmentos-clientes':
                nombre = 'Segmentos de Clientes';
                break;
            case 'estructura-costos':
                nombre = 'Estructura de Costos';
                break;
            case 'fuentes-ingresos':
                nombre = 'Fuentes de Ingresos';
                break;
            default:
                nombre = 'Campo';
                break;
        }

        return [
            {
                llave: 'tipo',
                nombre: 'Tipo',
                tipo: 'oculto',
                requerido: true,
                deshabilitado: true,
            },
            {
                llave: 'valor',
                nombre: nombre,
                tipo: 'textarea',
                requerido: false,
                deshabilitado: false,
            },
        ] as CampoDinamico[];
    });

    tituloEdicion = computed<string>(() => {
        const campoModalEditar = this.campoModalEditar();

        switch (campoModalEditar!.tipo) {
            case 'socios-clave':
                return 'Indica a tus socios clave';
            case 'actividades-clave':
                return 'Indica tus actividades clave';
            case 'recursos-clave':
                return 'Indica tus recursos clave';
            case 'propuesta-valor':
                return 'Indica tu propuesta de valor';
            case 'relaciones-clientes':
                return 'Indica tu relación con los clientes';
            case 'canales':
                return 'Indica tus canales';
            case 'segmentos-clientes':
                return 'Indica tus segmentos de clientes';
            case 'estructura-costos':
                return 'Indica tu estructura de costos';
            case 'fuentes-ingresos':
                return 'Indica tus fuentes de ingresos';
            default:
                return '';
        }
    });

    descripcionEdicion = computed<string>(() => {
        const campoModalEditar = this.campoModalEditar();

        switch (campoModalEditar!.tipo) {
            case 'socios-clave':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Quiénes nos ayudan a funcionar o crecer? Incluye proveedores, aliados, instituciones, distribuidores, partners, etc.</p>';
            case 'actividades-clave':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Qué debemos hacer para que el negocio funcione? Son las actividades esenciales para entregar la propuesta de valor.</p>';
            case 'recursos-clave':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Qué necesitamos para funcionar? Incluye recursos humanos, tecnológicos, físicos, financieros, intelectuales, etc.</p>';
            case 'propuesta-valor':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Qué ofrecemos y por qué nos elegirían? Es el problema que resolvemos, la necesidad que satisfacemos o el beneficio que entregamos.</p>';
            case 'relaciones-clientes':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Cómo nos relacionamos con ellos? Define cómo captamos, atendemos, acompañamos y fidelizamos a los clientes.</p>';
            case 'canales':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Cómo llegamos a nuestros clientes? Son los medios para dar a conocer, vender y entregar nuestro producto o servicio.</p>';
            case 'segmentos-clientes':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿A quién le vendemos? Identifica los grupos de personas o empresas que tienen la necesidad que resolvemos.</p>';
            case 'estructura-costos':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿En qué gastamos dinero? Identifica los principales costos necesarios para operar y entregar la propuesta de valor.</p>';
            case 'fuentes-ingresos':
                return '<p class="text-left text-sm opacity-80 mx-1 mb-2 text-wrap max-w-120">¿Cómo ganamos dinero? Identifica qué pagan los clientes, cuánto pagan y por qué modalidad.</p>';
            default:
                return '';
        }
    });

    private readonly modelosCanvas = signal([] as SalModeloCanvas[]);
    modelosCanvasMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    id: 0,
                    sociosClave: 'Ej: Proveedores de alimentos e insumos; distribuidores; servicios de delivery; proveedores de equipamiento; contador.',
                    actividadesClave: 'Ej: Preparación y venta de alimentos; compra de insumos; control de inventario.',
                    recursosClave: 'Ej: Local; equipamiento de cocina; materias primas; personal; sistema de gestión.',
                    propuestaValor: 'Ej: Café de buena calidad a precio accesible; productos frescos; atención rápida y cercana; ambiente cómodo y acogedor.',
                    relacionesClientes: 'Ej: Atención personalizada; programa de fidelización; comunicación por redes sociales.',
                    canales: 'Ej: Local físico; Instagram; TikTok; WhatsApp; recomendaciones de clientes.',
                    segmentosClientes: 'Ej: Vecinos del sector; trabajadores y profesionales cercanos; clientes que compran café para llevar.',
                    estructuraCostos: 'Ej: Arriendo; remuneraciones; materias primas; servicios básicos; comisiones; mantención de equipos.',
                    fuentesIngresos: 'Ej: Venta de café, té y otras bebidas; pastelería; sándwiches y productos salados.',
                    fechaCreacion: new Date().toISOString(),
                } as SalModeloCanvas,
                {
                    id: -1,
                    sociosClave: '',
                    actividadesClave: '',
                    recursosClave: '',
                    propuestaValor: '',
                    relacionesClientes: '',
                    canales: '',
                    segmentosClientes: '',
                    estructuraCostos: '',
                    fuentesIngresos: '',
                    fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                } as SalModeloCanvas,
            ] as SalModeloCanvas[];
        }
        return this.modelosCanvas();
    });
    cargandoModelosCanvas = signal(true);
    error = signal('');

    modeloCanvasSeleccionado = signal<SalModeloCanvas | null>(null);
    modeloCanvasSeleccionadoMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return this.modelosCanvasMostrar().length > 0 ? this.modelosCanvasMostrar()[0] : null;
        }
        return this.modeloCanvasSeleccionado();
    });

    constructor() {
        effect(() => {
            const negocioSeleccionado = this.negocioStore.negocioSeleccionado();

            untracked(() => {
                if (negocioSeleccionado) {
                    this.modeloCanvasSeleccionado.set(null);
                    this.obtenerModelosCanvas();
                }
            });
        });

        effect(() => {
            const ayuda = this.ayuda();

            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });
    }

    obtenerModelosCanvas(oculto: boolean = false, postEjecucion: (() => void) | null = null) {
        if (!oculto) {
            this.cargandoModelosCanvas.set(true);
        }

        this.modelosCanvasDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
                    const seleccionar = sorted.find((x) => x.id === this.modeloCanvasSeleccionadoMostrar()?.id);

                    if (seleccionar) {
                        this.modeloCanvasSeleccionado.set(seleccionar);
                    } else if (sorted.length > 0) {
                        this.modeloCanvasSeleccionado.set(sorted[0]);
                    } else {
                        this.modeloCanvasSeleccionado.set(null);
                    }

                    this.modelosCanvas.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los modelos Canvas', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los modelos Canvas');
                },
            })
            .add(() => {
                if (!oculto) {
                    this.cargandoModelosCanvas.set(false);
                }
                if (postEjecucion) postEjecucion();
            });
    }

    eliminarSeleccionado = signal<SalModeloCanvas | null>(null);

    openModalEliminar(item: SalModeloCanvas) {
        this.eliminarSeleccionado.set(item);
    }

    closeModalEliminar() {
        this.eliminarSeleccionado.set(null);
    }

    eliminando = signal<boolean>(false);
    eliminar(item: SalModeloCanvas) {
        this.eliminando.set(true);
        this.modelosCanvasDao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerModelosCanvas(true, () => {
                    this.eliminando.set(false);
                });
            },
            error: (err) => {
                console.error('Error al eliminar el modelo Canvas', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar el modelo Canvas');
            },
        });
        this.closeModalEliminar();
    }

    campoModalEditar = signal<CampoCanvas | null>(null);

    openModalEditar(
        tipo:
            | 'socios-clave'
            | 'actividades-clave'
            | 'recursos-clave'
            | 'propuesta-valor'
            | 'relaciones-clientes'
            | 'canales'
            | 'segmentos-clientes'
            | 'estructura-costos'
            | 'fuentes-ingresos',
    ) {
        let valor: string | null | undefined;
        switch (tipo) {
            case 'socios-clave':
                valor = this.modeloCanvasSeleccionadoMostrar()?.sociosClave;
                break;
            case 'actividades-clave':
                valor = this.modeloCanvasSeleccionadoMostrar()?.actividadesClave;
                break;
            case 'recursos-clave':
                valor = this.modeloCanvasSeleccionadoMostrar()?.recursosClave;
                break;
            case 'propuesta-valor':
                valor = this.modeloCanvasSeleccionadoMostrar()?.propuestaValor;
                break;
            case 'relaciones-clientes':
                valor = this.modeloCanvasSeleccionadoMostrar()?.relacionesClientes;
                break;
            case 'canales':
                valor = this.modeloCanvasSeleccionadoMostrar()?.canales;
                break;
            case 'segmentos-clientes':
                valor = this.modeloCanvasSeleccionadoMostrar()?.segmentosClientes;
                break;
            case 'estructura-costos':
                valor = this.modeloCanvasSeleccionadoMostrar()?.estructuraCostos;
                break;
            case 'fuentes-ingresos':
                valor = this.modeloCanvasSeleccionadoMostrar()?.fuentesIngresos;
                break;
        }

        this.campoModalEditar.set({
            tipo: tipo,
            valor: valor,
        } as CampoCanvas);
    }

    closeModalEditar() {
        this.campoModalEditar.set(null);
    }

    tipoCreandoOActualizando = signal<
        | 'socios-clave'
        | 'actividades-clave'
        | 'recursos-clave'
        | 'propuesta-valor'
        | 'relaciones-clientes'
        | 'canales'
        | 'segmentos-clientes'
        | 'estructura-costos'
        | 'fuentes-ingresos'
        | null
    >(null);
    creandoOActualizando = signal<boolean>(false);
    crearOActualizarModeloCanvas(campo: CampoCanvas) {
        this.creandoOActualizando.set(true);
        this.tipoCreandoOActualizando.set(campo.tipo);

        const modeloCanvas = this.modeloCanvasSeleccionadoMostrar();

        let entrada: EntModeloCanvasCrear | EntModeloCanvasActualizar;
        if (modeloCanvas) {
            entrada = {
                id: modeloCanvas.id,
                sociosClave: campo.tipo === 'socios-clave' ? campo.valor : modeloCanvas.sociosClave,
                actividadesClave: campo.tipo === 'actividades-clave' ? campo.valor : modeloCanvas.actividadesClave,
                recursosClave: campo.tipo === 'recursos-clave' ? campo.valor : modeloCanvas.recursosClave,
                propuestaValor: campo.tipo === 'propuesta-valor' ? campo.valor : modeloCanvas.propuestaValor,
                relacionesClientes: campo.tipo === 'relaciones-clientes' ? campo.valor : modeloCanvas.relacionesClientes,
                canales: campo.tipo === 'canales' ? campo.valor : modeloCanvas.canales,
                segmentosClientes: campo.tipo === 'segmentos-clientes' ? campo.valor : modeloCanvas.segmentosClientes,
                estructuraCostos: campo.tipo === 'estructura-costos' ? campo.valor : modeloCanvas.estructuraCostos,
                fuentesIngresos: campo.tipo === 'fuentes-ingresos' ? campo.valor : modeloCanvas.fuentesIngresos,
            } as EntModeloCanvasActualizar;
        } else {
            entrada = {
                idNegocio: this.negocioStore.negocioSeleccionado()?.id!,
                sociosClave: campo.tipo === 'socios-clave' ? campo.valor : null,
                actividadesClave: campo.tipo === 'actividades-clave' ? campo.valor : null,
                recursosClave: campo.tipo === 'recursos-clave' ? campo.valor : null,
                propuestaValor: campo.tipo === 'propuesta-valor' ? campo.valor : null,
                relacionesClientes: campo.tipo === 'relaciones-clientes' ? campo.valor : null,
                canales: campo.tipo === 'canales' ? campo.valor : null,
                segmentosClientes: campo.tipo === 'segmentos-clientes' ? campo.valor : null,
                estructuraCostos: campo.tipo === 'estructura-costos' ? campo.valor : null,
                fuentesIngresos: campo.tipo === 'fuentes-ingresos' ? campo.valor : null,
            } as EntModeloCanvasCrear;
        }

        if (modeloCanvas) {
            this.modelosCanvasDao
                .actualizar(entrada as EntModeloCanvasActualizar)
                .subscribe({
                    error: (err) => {
                        console.error('Error al editar el modelo Canvas', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al editar el modelo Canvas');
                    },
                })
                .add(() => {
                    this.obtenerModelosCanvas(true, () => {
                        this.tipoCreandoOActualizando.set(null);
                        this.creandoOActualizando.set(false);
                    });
                });
        } else {
            this.modelosCanvasDao
                .crear(entrada as EntModeloCanvasCrear)
                .subscribe({
                    error: (err) => {
                        console.error('Error al crear el modelo Canvas', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al crear el modelo Canvas');
                    },
                })
                .add(() => {
                    this.obtenerModelosCanvas(true, () => {
                        this.tipoCreandoOActualizando.set(null);
                        this.creandoOActualizando.set(false);
                    });
                });
        }

        this.closeModalEditar();
    }

    formatearFecha(texto: string) {
        return this.datePipe.transform(texto, "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm");
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a tu Modelo de Negocio',
                    description: 'Ahora que ya estamos en tu Modelo de Negocio, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá está tu Modelo de Negocio',
                    description: 'Aquí podrás crear tu Modelo de Negocio Canvas, definiendo cada uno de sus bloques fundamentales.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#historial-modelos-canvas',
                    popover: {
                        title: 'Tus modelos Canvas',
                        description:
                            'Comenzamos con un listado de todos tus Modelos Canvas, puedes tener varias versiones y seleccionar la que desees revisar.',
                    },
                },
                {
                    element: '#nuevo-modelo',
                    popover: {
                        title: 'Crear un nuevo modelo',
                        description: 'Si deseas crear un nuevo modelo, solo necesitas seleccionar acá y empezar a rellenar los datos.',
                    },
                },
                {
                    element: '#socios-clave',
                    popover: {
                        title: 'Socios clave',
                        description: 'Primero, identifica a las personas, empresas u organizaciones que ayudan a que tu negocio funcione.',
                    },
                },
                {
                    element: '#actividades-clave',
                    popover: {
                        title: 'Actividades clave',
                        description: 'Segundo, identifica las principales actividades que el negocio debe realizar para funcionar correctamente.',
                    },
                },
                {
                    element: '#recursos-clave',
                    popover: {
                        title: 'Recursos clave',
                        description: 'Tercero, identifica los recursos que el negocio necesita para poder entregar su propuesta de valor.',
                    },
                },
                {
                    element: '#propuesta-valor',
                    popover: {
                        title: 'Propuesta de valor',
                        description: 'Cuarto, describe qué ofrece el negocio y por qué un cliente debería elegirlo en lugar de otra alternativa.',
                    },
                },
                {
                    element: '#relaciones-clientes',
                    popover: {
                        title: 'Relación con clientes',
                        description: 'Quinto, describe cómo el negocio interactúa con sus clientes y qué tipo de relación busca construir con ellos.',
                    },
                },
                {
                    element: '#canales',
                    popover: {
                        title: 'Canales',
                        description:
                            'Sexto, identifica los medios que utiliza el negocio para comunicarse con sus clientes y entregarles su propuesta de valor.',
                    },
                },
                {
                    element: '#segmentos-clientes',
                    popover: {
                        title: 'Segmentos de clientes',
                        description:
                            'Séptimo, define quiénes son las personas o empresas a las que el negocio busca venderles, agrupándolos según características similares.',
                    },
                },
                {
                    element: '#estructura-costos',
                    popover: {
                        title: 'Estructura de costos',
                        description: 'Octavo, identifica los principales costos que debe asumir el negocio para funcionar.',
                    },
                },
                {
                    element: '#fuentes-ingresos',
                    popover: {
                        title: 'Fuentes de ingresos',
                        description: 'Y para terminar, explica de qué manera el negocio obtiene dinero de sus clientes.',
                    },
                },
                {
                    element: '#boton-eliminar',
                    popover: {
                        title: 'Eliminar tu modelo Canvas',
                        description: 'Además, puedes eliminar tu modelo Canvas si lo deseas. Siempre podrás crear uno nuevo.',
                    },
                },
            ] as DriveStep[]),
        );

        let config: {
            pasos: DriveStep[];
            onFinish?: (element: Element | undefined, step: DriveStep, options: any) => void;
            showProgress?: boolean;
            doneBtnText?: string;
            onNextFromLast?: (element: Element | undefined, step: DriveStep, options: any) => void;
        } = {
            pasos: steps,
            onFinish: () => {
                this.ayudaRunning.set(false);
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
            onNextFromLast: () => {
                if (this.ayuda() === '1') {
                    this.router.navigate(['/crear-obligacion'], { queryParams: { ayuda: 1 } });
                }
            },
        };

        if (this.ayuda() === '1') {
            config = {
                ...config,
                showProgress: true,
            };
        }

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}

export interface CampoCanvas {
    tipo:
        | 'socios-clave'
        | 'actividades-clave'
        | 'recursos-clave'
        | 'propuesta-valor'
        | 'relaciones-clientes'
        | 'canales'
        | 'segmentos-clientes'
        | 'estructura-costos'
        | 'fuentes-ingresos';
    valor: string | null;
}
