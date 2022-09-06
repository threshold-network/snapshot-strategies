import { getAddress } from '@ethersproject/address';
import { subgraphRequest } from '../../utils';

const SUBGRAPH_URL = {
  '1': 'https://api.studio.thegraph.com/query/24143/main-threshold-subgraph/0.0.6'
};
const maxResultsPerQuery = 1000;

export const author = 'manumonti';
export const version = '0.1.0';

export async function strategy(
  _space,
  network,
  _provider,
  addresses,
  options,
  snapshot
) {
  const params = {
    accounts: {
      __args: {
        where: {
          id_in: addresses.map((address) => address.toLowerCase())
        },
        first: maxResultsPerQuery,
        skip: 0
      },
      id: true,
      stakes: {
        id: true,
        totalStaked: true
      }
    }
  };
  if (snapshot !== 'latest') {
    // @ts-ignore
    params.accounts.__args.block = { number: snapshot };
  }

  const score = {};

  const requestsNumber = addresses.length / maxResultsPerQuery;
  const requests = requestsNumber < 5 ? requestsNumber : 5;
  for (let i = 0; i < requests; i++) {
    const result = await subgraphRequest(
      options.subGraphURL ? options.subGraphURL : SUBGRAPH_URL[network],
      params
    );

    if (result && result.accounts) {
      result.accounts.forEach((account) => {
        const accountAddress = getAddress(account.id);
        const accountScore = account.stakes.reduce((total, stake) => {
          return total + Number(stake.totalStaked);
        }, 0);

        if (!score[accountAddress]) score[accountAddress] = 0;
        score[accountAddress] = score[accountAddress] + accountScore;
      });
    }
    params.accounts.__args.skip = (i + 1) * maxResultsPerQuery;
  }
  return score;
}
