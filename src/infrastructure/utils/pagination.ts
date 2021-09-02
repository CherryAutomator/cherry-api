/**
 * Receives optionally both the `amount` of records to be shown and the records `page` and returns the `limit` and `offset` for a query
 *
 * By default returns the corresponding to 10 records of page 1
 * @param params - Object containing the amount and the page
 * @param params.amount - The quantity of records to be retrieved per page
 * @param params.page - The page of records to be retrieved
 * @returns An object containing the corresponding limit and offset for a query
 */

 export function computeLimitAndOffset(params: { amount?: number | null; page?: number | null }): {
  limit: number;
  offset: number;
} {
  const { amount, page } = params;

  const computedPage = !page || page < 1 ? 1 : page;
  const limit = !amount || amount < 1 ? 10 : amount;
  const offset = (computedPage - 1) * limit;

  return { limit, offset };
}