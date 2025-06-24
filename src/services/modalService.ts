// src/services/ModalService.ts
import { createModalService } from '../components/ui/CreateModalService';

const modalInstance = createModalService();

export const Modal = modalInstance.Modal;
export const confirm = modalInstance.confirm;
export const prompt = modalInstance.prompt;
export const alert = modalInstance.alert;
