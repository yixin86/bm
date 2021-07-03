import { ethers, BigNumber } from "ethers";
import { Notify } from 'vant';

/**
    if (typeof ethereum == "undefined") {
        return;
    }
    window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    token = "0xxxxxx";
    abi  = "";
    ContractHelper.New(token, abi, signer);
    await ContractHelper.Method(token, 'totalSupply');
*/

/**
 * 合约调用助手, 支持多token
 */
class ContractHelper {
    // 合约对象
    static contracts = {};
    // 合约对象 => 常量
    static contractsAttributes = {};

    /**
     * 创建合约对象
     */
    static New(token, abi, signer) {
        this.contracts[token] = new ethers.Contract(
            token,
            abi,
            signer
        );

        this.contractsAttributes[token] = {};
        return this.contracts[token];
    }

    /**
     * 获取合约所有常量
     */
    static async ConstantAll(token) {
        for (let key in this.contracts[token].interface.functions) {
            var func = this.contracts[token].interface.functions[key];
            if (func.constant && func.inputs.length == 0) {
                this.Constant(token, func.name);
            }
        }

        return this.contractsAttributes[token];
    }

    /**
     * 获取合约指定常量
     */
    static async Constant(token, name, noCache = false) {
        if (!this.contractsAttributes[token].hasOwnProperty(name) || noCache) {
            this.contractsAttributes[token][name] = await this.MethodOrigin(token, name);
        }
        return this.contractsAttributes[token][name];
    }

    /**
     * 调用合约方法, 不处理任何数据
     */
    static async MethodOrigin(token, name, params = []) {
        let contract = this.contracts[token];
        try {
            return await contract[name](...params);
        } catch (error) {
            console.log(error);
            Notify(error?.data?.message || error?.message || JSON.stringify(error));
            return;
        }
    }

    /**
     * 调用合约方法, 处理 BigNumber 精度
     */
    static async Method(token, name, params = []) {
        var res = await this.MethodOrigin(token, name, params);
        // BigNumber 转换精度
        if (res instanceof BigNumber) {
            let decimals = await this.Constant(token, 'decimals');
            res = ethers.utils.formatUnits(res, decimals);
        }
        return res;
    }
}

export {
    ContractHelper
}
