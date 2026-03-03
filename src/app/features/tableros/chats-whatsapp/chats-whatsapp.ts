import { WhatsappConversaciones } from '@/app/components/whatsapp-conversaciones/whatsapp-conversaciones';
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCircleMore } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3 } from '@spartan-ng/helm/typography';
import { WhatsappMensajes } from '@/app/components/whatsapp-mensajes/whatsapp-mensajes';

@Component({
    selector: 'app-chats-whatsapp',
    imports: [WhatsappConversaciones, HlmH3, HlmIcon, NgIcon, WhatsappMensajes],
    templateUrl: './chats-whatsapp.html',
    styleUrl: './chats-whatsapp.scss',
    providers: [provideIcons({ lucideMessageCircleMore })],
})
export class ChatsWhatsapp {
    chatAbierto = signal('');

    numeroTelefonoCambiado(numeroTelefono: string) {
        this.chatAbierto.set(numeroTelefono);
    }
}
