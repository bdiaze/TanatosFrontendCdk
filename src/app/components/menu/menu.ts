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
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
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
import { filter, map } from 'rxjs';

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
    @Input() estatico = false;
    @Output() onClose = new EventEmitter<void>();

    private router = inject(Router);

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
    informacionUsuario = this.negocioStore.informacionUsuario;

    opcionesMenu = computed<OpcionMenu[]>(() => {
        const opciones: OpcionMenu[] = [];

        if (this.negocioSeleccionado()) {
            opciones.push({
                id: 'group-negocio-seleccionado',
                tipo: 'group',
                titulo: this.negocioSeleccionado()?.nombre!,
                items: [
                    {
                        id: 'group-negocio-seleccionado-item-mi-calendario',
                        tipo: 'item',
                        icon: 'lucideCalendarRange',
                        titulo: 'Mi Calendario',
                        url: '/mi-calendario',
                    },
                    {
                        id: 'group-negocio-seleccionado-item-configuracion',
                        tipo: 'item',
                        icon: 'lucideSettings',
                        titulo: 'Configuración',
                        items: [
                            {
                                id: 'group-negocio-seleccionado-item-configuracion-subitem-mis-obligaciones',
                                tipo: 'item',
                                icon: 'lucideCalendarCog',
                                titulo: 'Mis Obligaciones',
                                url: '/mis-obligaciones',
                            },
                            {
                                id: 'group-negocio-seleccionado-item-configuracion-subitem-plantillas-inscritas',
                                tipo: 'subitem',
                                titulo: 'Plantillas Inscritas',
                                icon: 'lucideClipboardPaste',
                                url: '/plantillas-inscritas',
                            },
                            {
                                id: 'group-negocio-seleccionado-item-configuracion-subitem-mis-destinatarios',
                                tipo: 'item',
                                icon: 'lucideSend',
                                titulo: 'Mis Destinatarios',
                                url: '/mis-destinatario',
                            },
                        ],
                    },
                ],
            });
        }

        opciones.push({
            id: 'group-general',
            tipo: 'group',
            titulo: 'General',
            items: [
                {
                    id: 'group-general-item-configuracion',
                    tipo: 'item',
                    titulo: 'Configuración',
                    icon: 'lucideSettings',
                    items: [
                        {
                            id: 'group-general-item-configuracion-subitem-mis-negocios',
                            tipo: 'subitem',
                            titulo: 'Mis Negocios',
                            icon: 'lucideStore',
                            url: '/mis-negocios',
                        },
                    ],
                },
            ],
        });

        if (this.accesoAdmin()) {
            opciones.push({
                id: 'group-administracion',
                tipo: 'group',
                titulo: 'Administración',
                items: [
                    {
                        id: 'group-administracion-item-mantenedores',
                        tipo: 'item',
                        titulo: 'Mantenedores',
                        icon: 'lucideSettings',
                        items: [
                            {
                                id: 'group-administracion-item-mantenedores-subitem-plantillas',
                                tipo: 'subitem',
                                titulo: 'Plantillas',
                                url: '/administracion/mantenedores/template',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-categoria-norma',
                                tipo: 'subitem',
                                titulo: 'Categoria Norma',
                                url: '/administracion/mantenedores/categoria-norma',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-rubro',
                                tipo: 'subitem',
                                titulo: 'Tipo Rubro',
                                url: '/administracion/mantenedores/tipo-rubro',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-actividad',
                                tipo: 'subitem',
                                titulo: 'Tipo Actividad',
                                url: '/administracion/mantenedores/tipo-actividad',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-destinatario',
                                tipo: 'subitem',
                                titulo: 'Tipo Destinatario',
                                url: '/administracion/mantenedores/tipo-receptor-notificacion',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-fiscalizador',
                                tipo: 'subitem',
                                titulo: 'Tipo Fiscalizador',
                                url: '/administracion/mantenedores/tipo-fiscalizador',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-periodicidad',
                                tipo: 'subitem',
                                titulo: 'Tipo Periodicidad',
                                url: '/administracion/mantenedores/tipo-periodicidad',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-unidad-tiempo',
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

    url = toSignal(
        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => this.router.url),
        ),
        { initialValue: this.router.url },
    );

    groupsAbiertos = new Set<string>([]);

    constructor() {
        effect(() => {
            if (this.sesionIniciada()) {
                this.obtenerNegocios();
                this.obtenerInformacionUsuario();
            }
        });

        effect(() => {
            const url = this.url();
            const opciones = this.opcionesMenu();

            for (const item of opciones) {
                if (item.tipo === 'item' && this.tieneUrlHijoActivo(item, url)) {
                    this.groupsAbiertos.add(item.id);
                } else if (item.tipo === 'group' && item.items) {
                    for (const item2 of item.items) {
                        if (this.tieneUrlHijoActivo(item2, url)) {
                            this.groupsAbiertos.add(item2.id);
                        }
                    }
                }
            }
        });
    }

    tieneUrlHijoActivo(opcion: OpcionMenu, url: string) {
        if (
            opcion.tipo === 'item' &&
            opcion.items &&
            opcion.items.some((subitem) => subitem.url === url)
        ) {
            return true;
        }
        return false;
    }

    itemCollapsibleChange(groupId: string, isOpen: boolean) {
        if (isOpen) {
            this.groupsAbiertos.add(groupId);
        } else {
            this.groupsAbiertos.delete(groupId);
        }
    }

    estaAbierto(groupId: string) {
        return this.groupsAbiertos.has(groupId);
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

    cargandoInformacionUsuario = signal<boolean>(true);

    obtenerInformacionUsuario() {
        this.cargandoInformacionUsuario.set(true);
        this.negocioDao
            .obtenerInformacionUsuario()
            .subscribe({})
            .add(() => {
                this.cargandoInformacionUsuario.set(false);
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
