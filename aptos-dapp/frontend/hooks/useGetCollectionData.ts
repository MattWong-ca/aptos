import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

import { aptosClient } from "@/utils/aptosClient";
import { COLLECTION_ADDRESS, MODULE_MINT_ADDRESS } from "@/constants";
import { AccountAddress } from "@aptos-labs/ts-sdk";


export interface Token {
    token_name: string;
    cdn_asset_uris: {
        cdn_image_uri: string;
        asset_uri: string;
    };
}

export interface Collection {
    creator_address: string;
    collection_id: string;
    collection_name: string;
    current_supply: number;
    max_supply: number;
    uri: string;
    description: string;
    cdn_asset_uris: {
        cdn_animation_uri: string;
        cdn_image_uri: string;
    };
}

interface MintQueryResult {
    start_date: string;
    end_date: string;
    current_collections_v2: Array<Collection>;
    current_collection_ownership_v2_view: {
        owner_address: string;
    };
    current_collection_ownership_v2_view_aggregate: {
        aggregate: {
            count: number;
        };
    };
    current_token_datas_v2: Array<Token>;
}

interface MintData {
    maxSupply: number;
    totalMinted: number;
    uniqueHolders: number;
    userMintBalance: number;
    collection: Collection;
    startDate: Date;
    endDate: Date;
    isMintActive: boolean;
    isMintInfinite: boolean;
}

export function useGetCollectionData(collection_address: string = COLLECTION_ADDRESS) {
    const { account } = useWallet();

    return useQuery({
        queryKey: ["app-state", collection_address],
        refetchInterval: 1000 * 30,
        queryFn: async () => {
            try {
                if (!collection_address) return null;

                console.log("collection_address", collection_address);

                const res = await aptosClient().queryIndexer<MintQueryResult>({
                    query: {
                        variables: {
                            collection_id: collection_address,
                        },
                        query: `
						query TokenQuery($collection_id: String) {
							current_collections_v2(
								where: { collection_id: { _eq: $collection_id } }
								limit: 1
							) {
                creator_address
                collection_id
								collection_name
								current_supply
								max_supply
								uri
								description
                cdn_asset_uris {
                  cdn_animation_uri
                  cdn_image_uri
                }
							}
							current_collection_ownership_v2_view_aggregate(
								where: { collection_id: { _eq: $collection_id } }
							) {
								aggregate {
									count(distinct: true, columns: owner_address)
								}
							}
						}`,
                    },
                });

                console.log("res", res);

                const collection = res.current_collections_v2[0];
                if (!collection) return null;

                console.log("collection", collection);

                const mintStageRes = await getActiveOrNextMintStage({ collection_address });
                console.log("test");
                console.log("mintStageRes", mintStageRes);
                // Only return collection data if no mint stage is found
                if (mintStageRes.length === 0) {
                    return {
                        maxSupply: collection.max_supply ?? 0,
                        totalMinted: collection.current_supply ?? 0,
                        uniqueHolders: res.current_collection_ownership_v2_view_aggregate.aggregate?.count ?? 0,
                        userMintBalance: 0,
                        collection,
                        endDate: new Date(),
                        startDate: new Date(),
                        isMintActive: false,
                        isMintInfinite: false,
                    } satisfies MintData;
                }

                const mint_stage = mintStageRes[0];
                const { startDate, endDate, isMintInfinite } = await getMintStageStartAndEndTime({
                    collection_address,
                    mint_stage,
                });
                const userMintBalance =
                    account == null
                        ? 0
                        : await getUserMintBalance({ user_address: account.address, collection_address, mint_stage });
                const isMintEnabled = await getMintEnabled({ collection_address });

                console.log('Debug mint data:', {
                  userMintBalance,
                  totalMinted: collection.current_supply,
                  maxSupply: collection.max_supply,
                  isMintEnabled,
                  startDate,
                  endDate,
                  currentDate: new Date()
                });

                return {
                    maxSupply: collection.max_supply ?? 0,
                    totalMinted: collection.current_supply ?? 0,
                    uniqueHolders: res.current_collection_ownership_v2_view_aggregate.aggregate?.count ?? 0,
                    userMintBalance,
                    collection,
                    endDate,
                    startDate,
                    isMintActive:
                        isMintEnabled &&
                        new Date() >= startDate &&
                        new Date() <= endDate &&
                        collection.max_supply > collection.current_supply,
                    isMintInfinite,
                } satisfies MintData;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
    });
}

type GetMintEnabledArguments = {
    collection_address: string;
};

const getMintEnabled = async ({ collection_address }: GetMintEnabledArguments) => {
    const mintEnabled = await aptosClient().view<[boolean]>({
        payload: {
            function: `${AccountAddress.from(MODULE_MINT_ADDRESS)}::launchpad::is_mint_enabled`,
            functionArguments: [collection_address],
        },
    });

    return mintEnabled[0];
};

type GetUserMintBalanceArguments = {
    collection_address: string;
    mint_stage: string;
    user_address: string;
};

const getUserMintBalance = async ({
    collection_address,
    mint_stage,
    user_address,
}: GetUserMintBalanceArguments) => {
    const userMintedAmount = await aptosClient().view<[string]>({
        payload: {
            function: `${AccountAddress.from(MODULE_MINT_ADDRESS)}::launchpad::get_mint_balance`,
            functionArguments: [collection_address, mint_stage, user_address],
        },
    });

    return Number(userMintedAmount[0]);
};

type GetRegistryArguments = {
    collection_address: string;
};

const getActiveOrNextMintStage = async ({ collection_address }: GetRegistryArguments) => {
    console.log("collection_address tt", collection_address);
    console.log("MODULE_MINT_ADDRESS tt", MODULE_MINT_ADDRESS);
    const mintStageRes = await aptosClient().view<[{ vec: [string] | [] }]>({
        payload: {
            function: `${AccountAddress.from(MODULE_MINT_ADDRESS)}::launchpad::get_active_or_next_mint_stage`,
            functionArguments: [collection_address],
        },
    });
    console.log("mintStageRes tt", mintStageRes);
    return mintStageRes[0].vec;
};



type GetMintStageStartAndEndTimeArguments = {
    collection_address: string;
    mint_stage: string;
};

const getMintStageStartAndEndTime = async ({
    collection_address,
    mint_stage,
}: GetMintStageStartAndEndTimeArguments) => {
    const startAndEndRes = await aptosClient().view<[string, string]>({
        payload: {
            function: `${AccountAddress.from(MODULE_MINT_ADDRESS)}::launchpad::get_mint_stage_start_and_end_time`,
            functionArguments: [collection_address, mint_stage],
        },
    });

    const [start, end] = startAndEndRes;
    return {
        startDate: new Date(parseInt(start, 10) * 1000),
        endDate: new Date(parseInt(end, 10) * 1000),
        // isMintInfinite is true if the mint stage is 100 years later
        isMintInfinite: parseInt(end, 10) === parseInt(start, 10) + 100 * 365 * 24 * 60 * 60,
    };
};
