# threshold-network-from-subgraph

Strategy to read accounts' staking balance from Threshold Network subgraph. Each Threshold Network
staking account (a.k.a. `owner`) can be composed of several stakes. The voter's score is calculated
as the sum of the token amount on each stake.

## Params

- `subGraphURL` - (**Optional**, `string`) The API address of Threshold Network subgraph.

## Limitations

Due to [5 requests
limitation](https://github.com/snapshot-labs/snapshot-strategies/tree/868a39c51db175dcc6db0c4ac8448d8becc8015c#code)
in snapshots strategies, the maximum amount of addresses to be passed is 5000.

## Example

Here is an example of parameters:

```json
{
  "subGraphURL": "https://api.studio.thegraph.com/query/24143/main-threshold-subgraph/0.0.6"
}
```
