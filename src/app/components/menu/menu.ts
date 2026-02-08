import { NegocioDao } from '@/app/daos/negocio-dao';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { setCookie } from '@/app/helpers/cookie-helper';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import {
    Component,
    computed,
    effect,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideCalendarCog,
    lucideCalendarRange,
    lucideChevronRight,
    lucideChevronsUpDown,
    lucideClipboardPaste,
    lucideHouse,
    lucideSend,
    lucideSettings,
    lucideStore,
    lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-menu',
    imports: [
        NgIcon,
        HlmIcon,
        RouterLink,
        HlmDropdownMenuImports,
        HlmCollapsibleImports,
        HlmSpinnerImports,
        HlmSeparatorImports,
        HlmButtonImports,
        RouterModule,
        HlmSkeletonImports,
        HlmScrollAreaImports,
    ],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
    providers: [
        provideIcons({
            lucideX,
            lucideHouse,
            lucideSettings,
            lucideChevronRight,
            lucideSend,
            lucideStore,
            lucideChevronsUpDown,
            lucideCalendarCog,
            lucideClipboardPaste,
            lucideCalendarRange,
        }),
    ],
})
export class Menu {
    @Output() onClick = new EventEmitter<void>();

    @Input() withClose = false;
    @Output() onClose = new EventEmitter<void>();

    authStore = inject(AuthStore);
    negocioStore = inject(NegocioStore);
    negocioDao = inject(NegocioDao);

    sesionIniciada = this.authStore.sesionIniciada;
    accesoAdmin = computed<boolean>(() => {
        const claims = this.authStore.claims();
        if (claims && claims['cognito:groups'] && claims['cognito:groups'].includes('Admin')) {
            return true;
        }
        return false;
    });

    negocioSeleccionado = this.negocioStore.negocioSeleccionado;
    negociosUsuario = this.negocioStore.negociosUsuario;

    opcionesMenu = computed<OpcionMenu[]>(() => {
        const opciones: OpcionMenu[] = [];

        if (this.negocioSeleccionado()) {
            opciones.push({
                id: crypto.randomUUID(),
                tipo: 'group',
                titulo: this.negocioSeleccionado()?.nombre!,
                items: [
                    {
                        id: crypto.randomUUID(),
                        tipo: 'item',
                        icon: 'lucideCalendarRange',
                        titulo: 'Mi Calendario',
                        url: 'tableros/vencimientos',
                    },
                    {
                        id: crypto.randomUUID(),
                        tipo: 'item',
                        icon: 'lucideSettings',
                        titulo: 'Configuración',
                        items: [
                            {
                                id: crypto.randomUUID(),
                                tipo: 'item',
                                icon: 'lucideCalendarCog',
                                titulo: 'Mis Obligaciones',
                                url: '/mantenedores/norma-suscrita',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Plantillas Inscritas',
                                icon: 'lucideClipboardPaste',
                                url: '/mantenedores/plantillas-inscritas',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'item',
                                icon: 'lucideSend',
                                titulo: 'Mis Destinatarios',
                                url: '/mantenedores/destinatario',
                            },
                        ],
                    },
                ],
            });
        }

        opciones.push({
            id: crypto.randomUUID(),
            tipo: 'group',
            titulo: 'General',
            items: [
                {
                    id: crypto.randomUUID(),
                    tipo: 'item',
                    titulo: 'Configuración',
                    icon: 'lucideSettings',
                    items: [
                        {
                            id: crypto.randomUUID(),
                            tipo: 'subitem',
                            titulo: 'Mis Negocios',
                            icon: 'lucideStore',
                            url: '/mantenedores/negocio',
                        },
                    ],
                },
            ],
        });

        if (this.accesoAdmin()) {
            opciones.push({
                id: crypto.randomUUID(),
                tipo: 'group',
                titulo: 'Administración',
                items: [
                    {
                        id: crypto.randomUUID(),
                        tipo: 'item',
                        titulo: 'Mantenedores',
                        icon: 'lucideSettings',
                        items: [
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Plantillas',
                                url: '/administracion/mantenedores/template',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Categoria Norma',
                                url: '/administracion/mantenedores/categoria-norma',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Rubro',
                                url: '/administracion/mantenedores/tipo-rubro',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Actividad',
                                url: '/administracion/mantenedores/tipo-actividad',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Destinatario',
                                url: '/administracion/mantenedores/tipo-receptor-notificacion',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Fiscalizador',
                                url: '/administracion/mantenedores/tipo-fiscalizador',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Periodicidad',
                                url: '/administracion/mantenedores/tipo-periodicidad',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Unidad Tiempo',
                                url: '/administracion/mantenedores/tipo-unidad-tiempo',
                            },
                        ],
                    },
                ],
            });
        }

        return opciones;
    });

    constructor() {
        effect(() => {
            if (this.sesionIniciada()) {
                this.obtenerNegocios();
            }
        });
    }

    cambiarNegocio(negocio: SalNegocio) {
        this.negocioSeleccionado.set(negocio);
        setCookie('NegocioSeleccionado', `${negocio.id}`);
    }

    cargandoNegocios = signal<boolean>(true);

    obtenerNegocios() {
        this.cargandoNegocios.set(true);
        this.negocioDao
            .obtenerVigentes()
            .subscribe({})
            .add(() => {
                this.cargandoNegocios.set(false);
            });
    }

    click() {
        this.onClick.emit();
    }

    cerrar() {
        this.onClose.emit();
    }
}

export interface OpcionMenu {
    id: string;
    tipo: string;
    titulo: string;
    icon?: string;
    url?: string;
    items?: OpcionMenu[];
}
