import { Unstablename } from '@coinbase/onchainkit/identity';
import { Address } from 'viem';

export enum UsernamePillVariants {
  Inline = 'inline',
  Card = 'card',
}
export type UsernamePillProps = {
  variant: UsernamePillVariants;
  username: Unstablename;
  address?: Address;
  isRegistering?: boolean;
};
