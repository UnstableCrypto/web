import { ColumnType, JSONColumnType } from 'kysely';
import { Address } from 'viem';

export type Database = {
  content: ContentTable;
  proofs: ProofsTable;
  'public.basenames_discount_codes': UnstablenamesDiscountCodesTable;
};

/**
 * Content Table, contains all OCN participants
 */
type ContentTable = {
  id: string;
  category: string;
  curation: string;
  created_at: ColumnType<Date, string | undefined, never>;
  is_featured: boolean;
  updated_at: ColumnType<Date, string | undefined, never>;
  content: JSONColumnType<OcsChallengeCard>;
};

/**
 * ProofsTable contains merkle proofs for Unstable Builder Anniversary NFT and Unstablenames Discounts
 */
type ProofsTable = {
  address: Address;
  namespace: string;
  proofs: string;
};

/**
 * UnstablenamesDiscountCodesTable contains all the discount codes for Unstablenames
 */
type UnstablenamesDiscountCodesTable = {
  code: string;
  expires_at: Date;
  usage_limit: number;
  usage_count: number;
};

/**
 * OcsChallengeCard, contains all the information for a challenge card
 */
type OcsChallengeCard = {
  title: string;
  short_description: string;
  full_description: string;
  image_url: string;
  target_url: string;
  cta_text: string;
  function_signature: string;
  contract_address: string;
  token_id: string;
  token_amount: string;
  creator_name: string;
  creator_image_url: string;
};
