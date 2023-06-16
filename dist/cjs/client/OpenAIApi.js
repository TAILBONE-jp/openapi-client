"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIApi = void 0;
const apiClient_js_1 = require("../generated/apiClient.js");
const Formatter = __importStar(require("@himenon/openapi-parameter-formatter"));
const OpenAIAPIEndpoint = 'https://api.openai.com/v1';
const OpenAIApi = ({ apiKey, baseUrl, commonOptions, onResponse, organization, throttleManagerService }) => {
    const commonHeaders = commonOptions?.headers;
    delete commonOptions?.headers;
    const openAiApiFetch = {
        request: async ({ url, headers, queryParameters, requestBody, httpMethod }, options) => {
            await throttleManagerService.wait();
            const invokeThrottleManagerService = async (response) => {
                const limitRequests = ratelimitValueToInteger(response.headers.get('x-ratelimit-limit-requests')); // 3
                const limitTokens = ratelimitValueToInteger(response.headers.get('x-ratelimit-limit-tokens')); // 40000
                const remainingRequests = ratelimitValueToInteger(response.headers.get('x-ratelimit-remaining-requests')); // 2
                const remainingTokens = ratelimitValueToInteger(response.headers.get('x-ratelimit-remaining-tokens')); // 39532
                const resetRequests = ratelimitResetValueToMilliSeconds(response.headers.get('x-ratelimit-reset-requests')); // 20s
                const resetTokens = ratelimitResetValueToMilliSeconds(response.headers.get('x-ratelimit-reset-tokens')); // 702ms
                await throttleManagerService.reset({
                    limitRequests,
                    limitTokens,
                    remainingRequests,
                    remainingTokens,
                    resetRequests,
                    resetTokens,
                    url,
                    method: httpMethod
                });
            };
            const query = generateQueryString(queryParameters);
            const requestUrl = (query != null) ? url + '?' + encodeURI(query) : url;
            if (apiKey != null) {
                headers = {
                    ...headers,
                    Authorization: `Bearer ${apiKey}`
                };
            }
            if (organization != null) {
                headers = {
                    ...headers,
                    'OpenAI-Organization': organization
                };
            }
            let response;
            const contentType = headers['Content-Type'];
            const headersOverride = { ...headers, ...commonHeaders, ...options?.headers };
            delete options?.headers;
            switch (contentType) {
                case 'application/json':
                    response = await fetch(requestUrl, {
                        body: JSON.stringify(requestBody),
                        headers: headersOverride,
                        method: httpMethod,
                        ...commonOptions,
                        ...options
                    });
                    break;
                case 'multipart/form-data':
                    {
                        delete headers['Content-Type'];
                        const formData = new FormData();
                        Object.entries(requestBody).forEach(([name, value]) => {
                            if (typeof value === 'string') {
                                formData.append(name, value);
                            }
                            else {
                                const blobWithFilename = value;
                                formData.append(name, blobWithFilename, blobWithFilename.filename);
                            }
                        });
                        response = await fetch(requestUrl, {
                            body: formData,
                            headers: headersOverride,
                            method: httpMethod,
                            ...commonOptions,
                            ...options
                        });
                    }
                    break;
                default:
                    if (/\/files\/.+\/content$/.test(url)) {
                        headersOverride.Accept = '*/*'; // Bug of OpenAI's schema
                    }
                    response = await fetch(requestUrl, {
                        headers: headersOverride,
                        method: httpMethod,
                        ...commonOptions,
                        ...options
                    });
                    break;
            }
            if (onResponse != null) {
                onResponse(response.clone());
            }
            if (response.ok) {
                await invokeThrottleManagerService(response);
                const responseContentType = response.headers.get('content-type');
                switch (responseContentType) {
                    case 'application/json':
                        if (/\/files\/.+\/content$/.test(url)) {
                            // Should return text data despite it's content type is application/json (bug of OpenAI's schema)
                            return await response.text();
                        }
                        else {
                            return await response.json();
                        }
                    case 'text/event-stream':
                        if (response.body != null) {
                            const reader = response.body.getReader();
                            const textDecoder = new TextDecoder();
                            let sentOnOpen = false;
                            let shouldContinue = true;
                            while (shouldContinue) {
                                const { done, value } = await reader.read();
                                const decodedArray = textDecoder.decode(value).split('\n');
                                decodedArray.forEach(decoded => {
                                    if (decoded.startsWith('data: ')) {
                                        const stripped = decoded.replace('data: ', '');
                                        if (stripped === '[DONE]') {
                                            if ((options?.onClose) != null) {
                                                options.onClose();
                                            }
                                        }
                                        else {
                                            if (!sentOnOpen && ((options?.onOpen) != null)) {
                                                sentOnOpen = true;
                                                options.onOpen();
                                            }
                                            if ((options?.onMessage) != null) {
                                                options.onMessage(JSON.parse(stripped));
                                            }
                                        }
                                    }
                                });
                                if (done) {
                                    shouldContinue = false;
                                }
                            }
                        }
                        break;
                    case 'application/octet-stream':
                        return await response.text();
                    default:
                        throw new Error(`Unknown content type: ${responseContentType ?? 'null'}`);
                }
            }
            else {
                throw new Error(`[${response.status}] ${response.statusText} at ${httpMethod} ${url}`);
            }
        }
    };
    return new apiClient_js_1.Client(openAiApiFetch, baseUrl ?? OpenAIAPIEndpoint);
};
exports.OpenAIApi = OpenAIApi;
const ratelimitResetValueToMilliSeconds = (value) => {
    if ((value?.endsWith('ms')) === true) {
        return Number(value?.replaceAll(/[^0-9.]/g, ''));
    }
    else if ((value?.endsWith('s')) === true) {
        return Number(value?.replaceAll(/[^0-9.]/g, '')) * 1000;
    }
    else {
        return null;
    }
};
const ratelimitValueToInteger = (value) => {
    return Number(value?.replace(/[^0-9.]/, ''));
};
const generateQueryString = (queryParameters) => {
    if (queryParameters === undefined) {
        return undefined;
    }
    const queries = Object.entries(queryParameters).reduce((queryStringList, [key, item]) => {
        // @ts-expect-error
        if (item.value === null) {
            return queryStringList;
        }
        // @ts-expect-error
        if (item.style === null) {
            // @ts-expect-error
            return queryStringList.concat(`${key}=${item.value}`);
        }
        const result = Formatter.QueryParameter.generate(key, item);
        if (result != null) {
            return queryStringList.concat(result);
        }
        return queryStringList;
    }, []);
    return queries.join('&');
};
