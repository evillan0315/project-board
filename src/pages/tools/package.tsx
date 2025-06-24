import { createSignal } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

import { useAuth } from '../../contexts/AuthContext';
import { PackageForm } from '../../components/PackageForm';

export default function Package() {
  return <PackageForm />;
}
