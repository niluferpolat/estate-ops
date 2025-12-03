export enum AgentRoles {
  SELLING_AGENT = 'selling_agent',
  LISTING_AGENT = 'listing_agent',
}
export const REQUIRED_ROLES = {
  [AgentRoles.LISTING_AGENT]: 1,
  [AgentRoles.SELLING_AGENT]: 1,
};
