import * as min from "min";
import { filmyBucket } from "./qiniu-bucket";

export const Config = {
    load(silent: boolean = false): Promise<any> {
        let config;

        if (config) {
            return Promise.resolve(JSON.parse(config))
        } else {
            return filmyBucket.getFile("config.json")
                        .then(body => {
                            config = body;
                            return JSON.parse(body)
                        })
        }
    },

    update(password: string, update: any = {}, silent = false) {
        if (typeof password !== "string") {
            throw new TypeError("类型错误")
        }

        return filmyBucket.fetchPutToken(password, "config.json")
                    .then(putToken => {
                        return Config.load(silent)
                                .then(oldConfig => [oldConfig,putToken])
                                .catch(() => [{},putToken])
                    })
                    .then(([config,putToken]) => {
                        config = config || {};

                        Object.assign(config, update);

                        const fileData: any = new Blob([JSON.stringify(config)], {type: "application/json"});
                        fileData.name = "config.json";
                        return filmyBucket.putFile(
                            fileData.name,
                            fileData,
                            {
                                putToken: putToken
                            }
                        )

                    })
    }
}
