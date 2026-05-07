import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model PaymentKey
 *
 */
export type PaymentKeyModel = runtime.Types.Result.DefaultSelection<Prisma.$PaymentKeyPayload>;
export type AggregatePaymentKey = {
    _count: PaymentKeyCountAggregateOutputType | null;
    _min: PaymentKeyMinAggregateOutputType | null;
    _max: PaymentKeyMaxAggregateOutputType | null;
};
export type PaymentKeyMinAggregateOutputType = {
    id: string | null;
    key: string | null;
    userId: string | null;
    createdAt: Date | null;
};
export type PaymentKeyMaxAggregateOutputType = {
    id: string | null;
    key: string | null;
    userId: string | null;
    createdAt: Date | null;
};
export type PaymentKeyCountAggregateOutputType = {
    id: number;
    key: number;
    userId: number;
    createdAt: number;
    _all: number;
};
export type PaymentKeyMinAggregateInputType = {
    id?: true;
    key?: true;
    userId?: true;
    createdAt?: true;
};
export type PaymentKeyMaxAggregateInputType = {
    id?: true;
    key?: true;
    userId?: true;
    createdAt?: true;
};
export type PaymentKeyCountAggregateInputType = {
    id?: true;
    key?: true;
    userId?: true;
    createdAt?: true;
    _all?: true;
};
export type PaymentKeyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentKey to aggregate.
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentKeys to fetch.
     */
    orderBy?: Prisma.PaymentKeyOrderByWithRelationInput | Prisma.PaymentKeyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PaymentKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentKeys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentKeys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PaymentKeys
    **/
    _count?: true | PaymentKeyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PaymentKeyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PaymentKeyMaxAggregateInputType;
};
export type GetPaymentKeyAggregateType<T extends PaymentKeyAggregateArgs> = {
    [P in keyof T & keyof AggregatePaymentKey]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePaymentKey[P]> : Prisma.GetScalarType<T[P], AggregatePaymentKey[P]>;
};
export type PaymentKeyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentKeyWhereInput;
    orderBy?: Prisma.PaymentKeyOrderByWithAggregationInput | Prisma.PaymentKeyOrderByWithAggregationInput[];
    by: Prisma.PaymentKeyScalarFieldEnum[] | Prisma.PaymentKeyScalarFieldEnum;
    having?: Prisma.PaymentKeyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaymentKeyCountAggregateInputType | true;
    _min?: PaymentKeyMinAggregateInputType;
    _max?: PaymentKeyMaxAggregateInputType;
};
export type PaymentKeyGroupByOutputType = {
    id: string;
    key: string;
    userId: string;
    createdAt: Date;
    _count: PaymentKeyCountAggregateOutputType | null;
    _min: PaymentKeyMinAggregateOutputType | null;
    _max: PaymentKeyMaxAggregateOutputType | null;
};
export type GetPaymentKeyGroupByPayload<T extends PaymentKeyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PaymentKeyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PaymentKeyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PaymentKeyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PaymentKeyGroupByOutputType[P]>;
}>>;
export type PaymentKeyWhereInput = {
    AND?: Prisma.PaymentKeyWhereInput | Prisma.PaymentKeyWhereInput[];
    OR?: Prisma.PaymentKeyWhereInput[];
    NOT?: Prisma.PaymentKeyWhereInput | Prisma.PaymentKeyWhereInput[];
    id?: Prisma.StringFilter<"PaymentKey"> | string;
    key?: Prisma.StringFilter<"PaymentKey"> | string;
    userId?: Prisma.StringFilter<"PaymentKey"> | string;
    createdAt?: Prisma.DateTimeFilter<"PaymentKey"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PaymentKeyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type PaymentKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    key?: string;
    AND?: Prisma.PaymentKeyWhereInput | Prisma.PaymentKeyWhereInput[];
    OR?: Prisma.PaymentKeyWhereInput[];
    NOT?: Prisma.PaymentKeyWhereInput | Prisma.PaymentKeyWhereInput[];
    userId?: Prisma.StringFilter<"PaymentKey"> | string;
    createdAt?: Prisma.DateTimeFilter<"PaymentKey"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "id" | "key">;
export type PaymentKeyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PaymentKeyCountOrderByAggregateInput;
    _max?: Prisma.PaymentKeyMaxOrderByAggregateInput;
    _min?: Prisma.PaymentKeyMinOrderByAggregateInput;
};
export type PaymentKeyScalarWhereWithAggregatesInput = {
    AND?: Prisma.PaymentKeyScalarWhereWithAggregatesInput | Prisma.PaymentKeyScalarWhereWithAggregatesInput[];
    OR?: Prisma.PaymentKeyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PaymentKeyScalarWhereWithAggregatesInput | Prisma.PaymentKeyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PaymentKey"> | string;
    key?: Prisma.StringWithAggregatesFilter<"PaymentKey"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"PaymentKey"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PaymentKey"> | Date | string;
};
export type PaymentKeyCreateInput = {
    id?: string;
    key?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPaymentKeysInput;
};
export type PaymentKeyUncheckedCreateInput = {
    id?: string;
    key?: string;
    userId: string;
    createdAt?: Date | string;
};
export type PaymentKeyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPaymentKeysNestedInput;
};
export type PaymentKeyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentKeyCreateManyInput = {
    id?: string;
    key?: string;
    userId: string;
    createdAt?: Date | string;
};
export type PaymentKeyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentKeyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentKeyListRelationFilter = {
    every?: Prisma.PaymentKeyWhereInput;
    some?: Prisma.PaymentKeyWhereInput;
    none?: Prisma.PaymentKeyWhereInput;
};
export type PaymentKeyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PaymentKeyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PaymentKeyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PaymentKeyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PaymentKeyCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PaymentKeyCreateWithoutUserInput, Prisma.PaymentKeyUncheckedCreateWithoutUserInput> | Prisma.PaymentKeyCreateWithoutUserInput[] | Prisma.PaymentKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentKeyCreateOrConnectWithoutUserInput | Prisma.PaymentKeyCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PaymentKeyCreateManyUserInputEnvelope;
    connect?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
};
export type PaymentKeyUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PaymentKeyCreateWithoutUserInput, Prisma.PaymentKeyUncheckedCreateWithoutUserInput> | Prisma.PaymentKeyCreateWithoutUserInput[] | Prisma.PaymentKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentKeyCreateOrConnectWithoutUserInput | Prisma.PaymentKeyCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PaymentKeyCreateManyUserInputEnvelope;
    connect?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
};
export type PaymentKeyUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentKeyCreateWithoutUserInput, Prisma.PaymentKeyUncheckedCreateWithoutUserInput> | Prisma.PaymentKeyCreateWithoutUserInput[] | Prisma.PaymentKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentKeyCreateOrConnectWithoutUserInput | Prisma.PaymentKeyCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PaymentKeyUpsertWithWhereUniqueWithoutUserInput | Prisma.PaymentKeyUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PaymentKeyCreateManyUserInputEnvelope;
    set?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    disconnect?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    delete?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    connect?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    update?: Prisma.PaymentKeyUpdateWithWhereUniqueWithoutUserInput | Prisma.PaymentKeyUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PaymentKeyUpdateManyWithWhereWithoutUserInput | Prisma.PaymentKeyUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PaymentKeyScalarWhereInput | Prisma.PaymentKeyScalarWhereInput[];
};
export type PaymentKeyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentKeyCreateWithoutUserInput, Prisma.PaymentKeyUncheckedCreateWithoutUserInput> | Prisma.PaymentKeyCreateWithoutUserInput[] | Prisma.PaymentKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentKeyCreateOrConnectWithoutUserInput | Prisma.PaymentKeyCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PaymentKeyUpsertWithWhereUniqueWithoutUserInput | Prisma.PaymentKeyUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PaymentKeyCreateManyUserInputEnvelope;
    set?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    disconnect?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    delete?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    connect?: Prisma.PaymentKeyWhereUniqueInput | Prisma.PaymentKeyWhereUniqueInput[];
    update?: Prisma.PaymentKeyUpdateWithWhereUniqueWithoutUserInput | Prisma.PaymentKeyUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PaymentKeyUpdateManyWithWhereWithoutUserInput | Prisma.PaymentKeyUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PaymentKeyScalarWhereInput | Prisma.PaymentKeyScalarWhereInput[];
};
export type PaymentKeyCreateWithoutUserInput = {
    id?: string;
    key?: string;
    createdAt?: Date | string;
};
export type PaymentKeyUncheckedCreateWithoutUserInput = {
    id?: string;
    key?: string;
    createdAt?: Date | string;
};
export type PaymentKeyCreateOrConnectWithoutUserInput = {
    where: Prisma.PaymentKeyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentKeyCreateWithoutUserInput, Prisma.PaymentKeyUncheckedCreateWithoutUserInput>;
};
export type PaymentKeyCreateManyUserInputEnvelope = {
    data: Prisma.PaymentKeyCreateManyUserInput | Prisma.PaymentKeyCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type PaymentKeyUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.PaymentKeyWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentKeyUpdateWithoutUserInput, Prisma.PaymentKeyUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PaymentKeyCreateWithoutUserInput, Prisma.PaymentKeyUncheckedCreateWithoutUserInput>;
};
export type PaymentKeyUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.PaymentKeyWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentKeyUpdateWithoutUserInput, Prisma.PaymentKeyUncheckedUpdateWithoutUserInput>;
};
export type PaymentKeyUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.PaymentKeyScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentKeyUpdateManyMutationInput, Prisma.PaymentKeyUncheckedUpdateManyWithoutUserInput>;
};
export type PaymentKeyScalarWhereInput = {
    AND?: Prisma.PaymentKeyScalarWhereInput | Prisma.PaymentKeyScalarWhereInput[];
    OR?: Prisma.PaymentKeyScalarWhereInput[];
    NOT?: Prisma.PaymentKeyScalarWhereInput | Prisma.PaymentKeyScalarWhereInput[];
    id?: Prisma.StringFilter<"PaymentKey"> | string;
    key?: Prisma.StringFilter<"PaymentKey"> | string;
    userId?: Prisma.StringFilter<"PaymentKey"> | string;
    createdAt?: Prisma.DateTimeFilter<"PaymentKey"> | Date | string;
};
export type PaymentKeyCreateManyUserInput = {
    id?: string;
    key?: string;
    createdAt?: Date | string;
};
export type PaymentKeyUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentKeyUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentKeyUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentKeySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentKey"]>;
export type PaymentKeySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentKey"]>;
export type PaymentKeySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentKey"]>;
export type PaymentKeySelectScalar = {
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    createdAt?: boolean;
};
export type PaymentKeyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "key" | "userId" | "createdAt", ExtArgs["result"]["paymentKey"]>;
export type PaymentKeyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PaymentKeyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PaymentKeyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PaymentKeyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PaymentKey";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        key: string;
        userId: string;
        createdAt: Date;
    }, ExtArgs["result"]["paymentKey"]>;
    composites: {};
};
export type PaymentKeyGetPayload<S extends boolean | null | undefined | PaymentKeyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload, S>;
export type PaymentKeyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PaymentKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaymentKeyCountAggregateInputType | true;
};
export interface PaymentKeyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PaymentKey'];
        meta: {
            name: 'PaymentKey';
        };
    };
    /**
     * Find zero or one PaymentKey that matches the filter.
     * @param {PaymentKeyFindUniqueArgs} args - Arguments to find a PaymentKey
     * @example
     * // Get one PaymentKey
     * const paymentKey = await prisma.paymentKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentKeyFindUniqueArgs>(args: Prisma.SelectSubset<T, PaymentKeyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PaymentKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentKeyFindUniqueOrThrowArgs} args - Arguments to find a PaymentKey
     * @example
     * // Get one PaymentKey
     * const paymentKey = await prisma.paymentKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentKeyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PaymentKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PaymentKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyFindFirstArgs} args - Arguments to find a PaymentKey
     * @example
     * // Get one PaymentKey
     * const paymentKey = await prisma.paymentKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentKeyFindFirstArgs>(args?: Prisma.SelectSubset<T, PaymentKeyFindFirstArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PaymentKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyFindFirstOrThrowArgs} args - Arguments to find a PaymentKey
     * @example
     * // Get one PaymentKey
     * const paymentKey = await prisma.paymentKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentKeyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PaymentKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PaymentKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentKeys
     * const paymentKeys = await prisma.paymentKey.findMany()
     *
     * // Get first 10 PaymentKeys
     * const paymentKeys = await prisma.paymentKey.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const paymentKeyWithIdOnly = await prisma.paymentKey.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PaymentKeyFindManyArgs>(args?: Prisma.SelectSubset<T, PaymentKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PaymentKey.
     * @param {PaymentKeyCreateArgs} args - Arguments to create a PaymentKey.
     * @example
     * // Create one PaymentKey
     * const PaymentKey = await prisma.paymentKey.create({
     *   data: {
     *     // ... data to create a PaymentKey
     *   }
     * })
     *
     */
    create<T extends PaymentKeyCreateArgs>(args: Prisma.SelectSubset<T, PaymentKeyCreateArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PaymentKeys.
     * @param {PaymentKeyCreateManyArgs} args - Arguments to create many PaymentKeys.
     * @example
     * // Create many PaymentKeys
     * const paymentKey = await prisma.paymentKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PaymentKeyCreateManyArgs>(args?: Prisma.SelectSubset<T, PaymentKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many PaymentKeys and returns the data saved in the database.
     * @param {PaymentKeyCreateManyAndReturnArgs} args - Arguments to create many PaymentKeys.
     * @example
     * // Create many PaymentKeys
     * const paymentKey = await prisma.paymentKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PaymentKeys and only return the `id`
     * const paymentKeyWithIdOnly = await prisma.paymentKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PaymentKeyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PaymentKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a PaymentKey.
     * @param {PaymentKeyDeleteArgs} args - Arguments to delete one PaymentKey.
     * @example
     * // Delete one PaymentKey
     * const PaymentKey = await prisma.paymentKey.delete({
     *   where: {
     *     // ... filter to delete one PaymentKey
     *   }
     * })
     *
     */
    delete<T extends PaymentKeyDeleteArgs>(args: Prisma.SelectSubset<T, PaymentKeyDeleteArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PaymentKey.
     * @param {PaymentKeyUpdateArgs} args - Arguments to update one PaymentKey.
     * @example
     * // Update one PaymentKey
     * const paymentKey = await prisma.paymentKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PaymentKeyUpdateArgs>(args: Prisma.SelectSubset<T, PaymentKeyUpdateArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PaymentKeys.
     * @param {PaymentKeyDeleteManyArgs} args - Arguments to filter PaymentKeys to delete.
     * @example
     * // Delete a few PaymentKeys
     * const { count } = await prisma.paymentKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PaymentKeyDeleteManyArgs>(args?: Prisma.SelectSubset<T, PaymentKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PaymentKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentKeys
     * const paymentKey = await prisma.paymentKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PaymentKeyUpdateManyArgs>(args: Prisma.SelectSubset<T, PaymentKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PaymentKeys and returns the data updated in the database.
     * @param {PaymentKeyUpdateManyAndReturnArgs} args - Arguments to update many PaymentKeys.
     * @example
     * // Update many PaymentKeys
     * const paymentKey = await prisma.paymentKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PaymentKeys and only return the `id`
     * const paymentKeyWithIdOnly = await prisma.paymentKey.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PaymentKeyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PaymentKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one PaymentKey.
     * @param {PaymentKeyUpsertArgs} args - Arguments to update or create a PaymentKey.
     * @example
     * // Update or create a PaymentKey
     * const paymentKey = await prisma.paymentKey.upsert({
     *   create: {
     *     // ... data to create a PaymentKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentKey we want to update
     *   }
     * })
     */
    upsert<T extends PaymentKeyUpsertArgs>(args: Prisma.SelectSubset<T, PaymentKeyUpsertArgs<ExtArgs>>): Prisma.Prisma__PaymentKeyClient<runtime.Types.Result.GetResult<Prisma.$PaymentKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PaymentKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyCountArgs} args - Arguments to filter PaymentKeys to count.
     * @example
     * // Count the number of PaymentKeys
     * const count = await prisma.paymentKey.count({
     *   where: {
     *     // ... the filter for the PaymentKeys we want to count
     *   }
     * })
    **/
    count<T extends PaymentKeyCountArgs>(args?: Prisma.Subset<T, PaymentKeyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PaymentKeyCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PaymentKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentKeyAggregateArgs>(args: Prisma.Subset<T, PaymentKeyAggregateArgs>): Prisma.PrismaPromise<GetPaymentKeyAggregateType<T>>;
    /**
     * Group by PaymentKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends PaymentKeyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PaymentKeyGroupByArgs['orderBy'];
    } : {
        orderBy?: PaymentKeyGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PaymentKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PaymentKey model
     */
    readonly fields: PaymentKeyFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PaymentKey.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PaymentKeyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the PaymentKey model
 */
export interface PaymentKeyFieldRefs {
    readonly id: Prisma.FieldRef<"PaymentKey", 'String'>;
    readonly key: Prisma.FieldRef<"PaymentKey", 'String'>;
    readonly userId: Prisma.FieldRef<"PaymentKey", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PaymentKey", 'DateTime'>;
}
/**
 * PaymentKey findUnique
 */
export type PaymentKeyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentKey to fetch.
     */
    where: Prisma.PaymentKeyWhereUniqueInput;
};
/**
 * PaymentKey findUniqueOrThrow
 */
export type PaymentKeyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentKey to fetch.
     */
    where: Prisma.PaymentKeyWhereUniqueInput;
};
/**
 * PaymentKey findFirst
 */
export type PaymentKeyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentKey to fetch.
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentKeys to fetch.
     */
    orderBy?: Prisma.PaymentKeyOrderByWithRelationInput | Prisma.PaymentKeyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PaymentKeys.
     */
    cursor?: Prisma.PaymentKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentKeys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentKeys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaymentKeys.
     */
    distinct?: Prisma.PaymentKeyScalarFieldEnum | Prisma.PaymentKeyScalarFieldEnum[];
};
/**
 * PaymentKey findFirstOrThrow
 */
export type PaymentKeyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentKey to fetch.
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentKeys to fetch.
     */
    orderBy?: Prisma.PaymentKeyOrderByWithRelationInput | Prisma.PaymentKeyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PaymentKeys.
     */
    cursor?: Prisma.PaymentKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentKeys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentKeys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaymentKeys.
     */
    distinct?: Prisma.PaymentKeyScalarFieldEnum | Prisma.PaymentKeyScalarFieldEnum[];
};
/**
 * PaymentKey findMany
 */
export type PaymentKeyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentKeys to fetch.
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentKeys to fetch.
     */
    orderBy?: Prisma.PaymentKeyOrderByWithRelationInput | Prisma.PaymentKeyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PaymentKeys.
     */
    cursor?: Prisma.PaymentKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentKeys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentKeys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaymentKeys.
     */
    distinct?: Prisma.PaymentKeyScalarFieldEnum | Prisma.PaymentKeyScalarFieldEnum[];
};
/**
 * PaymentKey create
 */
export type PaymentKeyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * The data needed to create a PaymentKey.
     */
    data: Prisma.XOR<Prisma.PaymentKeyCreateInput, Prisma.PaymentKeyUncheckedCreateInput>;
};
/**
 * PaymentKey createMany
 */
export type PaymentKeyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentKeys.
     */
    data: Prisma.PaymentKeyCreateManyInput | Prisma.PaymentKeyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PaymentKey createManyAndReturn
 */
export type PaymentKeyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * The data used to create many PaymentKeys.
     */
    data: Prisma.PaymentKeyCreateManyInput | Prisma.PaymentKeyCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * PaymentKey update
 */
export type PaymentKeyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * The data needed to update a PaymentKey.
     */
    data: Prisma.XOR<Prisma.PaymentKeyUpdateInput, Prisma.PaymentKeyUncheckedUpdateInput>;
    /**
     * Choose, which PaymentKey to update.
     */
    where: Prisma.PaymentKeyWhereUniqueInput;
};
/**
 * PaymentKey updateMany
 */
export type PaymentKeyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentKeys.
     */
    data: Prisma.XOR<Prisma.PaymentKeyUpdateManyMutationInput, Prisma.PaymentKeyUncheckedUpdateManyInput>;
    /**
     * Filter which PaymentKeys to update
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * Limit how many PaymentKeys to update.
     */
    limit?: number;
};
/**
 * PaymentKey updateManyAndReturn
 */
export type PaymentKeyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * The data used to update PaymentKeys.
     */
    data: Prisma.XOR<Prisma.PaymentKeyUpdateManyMutationInput, Prisma.PaymentKeyUncheckedUpdateManyInput>;
    /**
     * Filter which PaymentKeys to update
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * Limit how many PaymentKeys to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * PaymentKey upsert
 */
export type PaymentKeyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * The filter to search for the PaymentKey to update in case it exists.
     */
    where: Prisma.PaymentKeyWhereUniqueInput;
    /**
     * In case the PaymentKey found by the `where` argument doesn't exist, create a new PaymentKey with this data.
     */
    create: Prisma.XOR<Prisma.PaymentKeyCreateInput, Prisma.PaymentKeyUncheckedCreateInput>;
    /**
     * In case the PaymentKey was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PaymentKeyUpdateInput, Prisma.PaymentKeyUncheckedUpdateInput>;
};
/**
 * PaymentKey delete
 */
export type PaymentKeyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
    /**
     * Filter which PaymentKey to delete.
     */
    where: Prisma.PaymentKeyWhereUniqueInput;
};
/**
 * PaymentKey deleteMany
 */
export type PaymentKeyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentKeys to delete
     */
    where?: Prisma.PaymentKeyWhereInput;
    /**
     * Limit how many PaymentKeys to delete.
     */
    limit?: number;
};
/**
 * PaymentKey without action
 */
export type PaymentKeyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentKey
     */
    select?: Prisma.PaymentKeySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentKey
     */
    omit?: Prisma.PaymentKeyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentKeyInclude<ExtArgs> | null;
};
//# sourceMappingURL=PaymentKey.d.ts.map