<template>
    <div class="page home">
        <van-panel title="合约地址" :desc="token"></van-panel>
        <van-panel title="钱包地址" :desc="address"></van-panel>
        <van-panel
            :title="'我的' + symbol + '余额'"
            :desc="balance"
        ></van-panel>
        <van-panel title="质押数量" :desc="staked"></van-panel>
        <van-panel title="解押数量" :desc="unstake"></van-panel>
        <van-panel title="领奖周期" :desc="rewardDuration.toString() + '秒'"></van-panel>

        <div class="pd15">
            <van-button block @click="rewardMethod" type="primary">领取每日奖励</van-button>
        </div>
        <van-field v-model="stakeAmount" type="number" center clearable placeholder="请输入质押数量">
            <template #button>
                <van-button @click="stakeMethod" type="primary">质押</van-button>
            </template>
        </van-field>

        <van-field v-model="unstakeAmount" type="number" center clearable placeholder="请输入解押数量">
            <template #button>
                <van-button @click="unstakeMethod" type="primary">解押</van-button>
            </template>
        </van-field>

        <van-field v-model="withdrawAmount" type="number" center clearable placeholder="请输入提现数量">
            <template #button>
                <van-button @click="withdrawMethod" type="primary">提现</van-button>
            </template>
        </van-field>

        <van-field center v-model="inviter" clearable placeholder="请输入邀请人地址">
            <template #button>
                <van-button @click="setInviterMethod" type="primary">设置邀请人</van-button>
            </template>
        </van-field>
    </div>
</template>

<script>
import { ContractHelper } from "../tools/ContractHelper";
import { ABI } from "../tools/ABI";
import { ethers, BigNumber } from "ethers";

export default {
    name: "Home",
    data() {
        return {
            provider: null,
            signer: null,
            token: "0x337573312D97E3081D3297Dd2229AD31352A37a8",
            symbol: "",
            address: "",
            rewardDuration: "",
            balance: "0",
            staked: "0",
            unstake: "0",
            decimals: "",

            stakeAmount: "",
            unstakeAmount: "",
            withdrawAmount: "",

            inviter: "",
        };
    },
    created() {
        if (typeof ethereum == "undefined") {
            this.$notify({
                message: "请在钱包中打开",
                duration: 0,
                type: "warning",
            });
            return;
        }

        this.init();
    },
    methods: {
        async init() {
            // 等价 ethereum.enable();
            await ethereum.request({ method: "eth_requestAccounts" });
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();

            this.address = await this.signer.getAddress();

            // 合约对象
            ContractHelper.New(this.token, ABI, this.signer);
            this.rewardDuration = await ContractHelper.MethodOrigin(this.token, "rewardDuration");
            this.decimals = (await ContractHelper.MethodOrigin(this.token, "decimals")).toString();
            this.balance = await ContractHelper.Method(
                this.token,
                "balanceOf",
                [this.address]
            );
            this.unstake = await ContractHelper.Method(
                this.token,
                "unstakeOf",
                [this.address]
            );
            this.staked = await ContractHelper.Method(
                this.token,
                "stakedOf",
                [this.address]
            );
            this.symbol = (
                await ContractHelper.Method(this.token, "symbol")
            ).toUpperCase();
        },
        async stakeMethod() {
            let amount = ethers.utils.parseUnits(this.stakeAmount, this.decimals);
            await ContractHelper.Method(this.token, "stake", [amount]);
        },
        async unstakeMethod() {
            let amount = ethers.utils.parseUnits(this.unstakeAmount, this.decimals);
            await ContractHelper.Method(this.token, "unstake", [amount]);
        },
        async withdrawMethod() {
            let amount = ethers.utils.parseUnits(this.withdrawAmount, this.decimals);
            await ContractHelper.Method(this.token, "withdraw", [amount]);
        },
        async rewardMethod() {
            await ContractHelper.Method(this.token, "reward");
        },
        async setInviterMethod() {
            await ContractHelper.Method(this.token, "setInviter", [this.inviter]);
        },
    },
};
</script>

<style scoped lang="less">
.pd15 {
    padding: 30px;
}

.info {
    font-size: 12px;
}
</style>
