export declare namespace Schemas {
    interface Error {
        type: string;
        message: string;
        param: string | null;
        code: string | null;
    }
    interface ErrorResponse {
        error: Schemas.Error;
    }
    interface ListModelsResponse {
        object: string;
        data: Schemas.Model[];
    }
    interface DeleteModelResponse {
        id: string;
        object: string;
        deleted: boolean;
    }
    interface CreateCompletionRequest {
        /** ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them. */
        model: string | ("text-davinci-003" | "text-davinci-002" | "text-davinci-001" | "code-davinci-002" | "text-curie-001" | "text-babbage-001" | "text-ada-001");
        /**
         * The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.
         *
         * Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.
         */
        prompt: (string | string[] | number[] | number[][]) | null;
        /** The suffix that comes after a completion of inserted text. */
        suffix?: string | null;
        /**
         * The maximum number of [tokens](/tokenizer) to generate in the completion.
         *
         * The token count of your prompt plus `max_tokens` cannot exceed the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.
         */
        max_tokens?: number | null;
        /**
         * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
         *
         * We generally recommend altering this or `top_p` but not both.
         */
        temperature?: number | null;
        /**
         * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
         *
         * We generally recommend altering this or `temperature` but not both.
         */
        top_p?: number | null;
        /**
         * How many completions to generate for each prompt.
         *
         * **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
         */
        n?: number | null;
        /** Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb). */
        stream?: boolean | null;
        /**
         * Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.
         *
         * The maximum value for `logprobs` is 5.
         */
        logprobs?: number | null;
        /** Echo back the prompt in addition to the completion */
        echo?: boolean | null;
        /** Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence. */
        stop?: ((string | null) | string[]) | null;
        /**
         * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
         *
         * [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
         */
        presence_penalty?: number | null;
        /**
         * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
         *
         * [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
         */
        frequency_penalty?: number | null;
        /**
         * Generates `best_of` completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.
         *
         * When used with `n`, `best_of` controls the number of candidate completions and `n` specifies how many to return – `best_of` must be greater than `n`.
         *
         * **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
         */
        best_of?: number | null;
        /**
         * Modify the likelihood of specified tokens appearing in the completion.
         *
         * Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](/tokenizer?view=bpe) (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
         *
         * As an example, you can pass `{"50256": -100}` to prevent the <|endoftext|> token from being generated.
         */
        logit_bias?: {} | null;
        /** A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids). */
        user?: string;
    }
    interface CreateCompletionResponse {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: {
            text: string;
            index: number;
            logprobs: {
                tokens?: string[];
                token_logprobs?: number[];
                top_logprobs?: {}[];
                text_offset?: number[];
            } | null;
            finish_reason: "stop" | "length";
        }[];
        usage?: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
    }
    interface ChatCompletionRequestMessage {
        /** The role of the messages author. One of `system`, `user`, `assistant`, or `function`. */
        role: "system" | "user" | "assistant" | "function";
        /** The contents of the message. `content` is required for all messages except assistant messages with function calls. */
        content?: string;
        /** The name of the author of this message. `name` is required if role is `function`, and it should be the name of the function whose response is in the `content`. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters. */
        name?: string;
        /** The name and arguments of a function that should be called, as generated by the model. */
        function_call?: {
            /** The name of the function to call. */
            name?: string;
            /** The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function. */
            arguments?: string;
        };
    }
    /** The parameters the functions accepts, described as a JSON Schema object. See the [guide](/docs/guides/gpt/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. */
    interface ChatCompletionFunctionParameters {
        [key: string]: {};
    }
    interface ChatCompletionFunctions {
        /** The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64. */
        name: string;
        /** The description of what the function does. */
        description?: string;
        parameters?: Schemas.ChatCompletionFunctionParameters;
    }
    interface ChatCompletionResponseMessage {
        /** The role of the author of this message. */
        role: "system" | "user" | "assistant" | "function";
        /** The contents of the message. */
        content?: string | null;
        /** The name and arguments of a function that should be called, as generated by the model. */
        function_call?: {
            /** The name of the function to call. */
            name?: string;
            /** The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function. */
            arguments?: string;
        };
    }
    interface ChatCompletionStreamResponseDelta {
        /** The role of the author of this message. */
        role?: "system" | "user" | "assistant" | "function";
        /** The contents of the chunk message. */
        content?: string | null;
        /** The name and arguments of a function that should be called, as generated by the model. */
        function_call?: {
            /** The name of the function to call. */
            name?: string;
            /** The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function. */
            arguments?: string;
        };
    }
    interface CreateChatCompletionRequest {
        /** ID of the model to use. See the [model endpoint compatibility](/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API. */
        model: string | ("gpt-4" | "gpt-4-0613" | "gpt-4-32k" | "gpt-4-32k-0613" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-3.5-turbo-0613" | "gpt-3.5-turbo-16k-0613");
        /** A list of messages comprising the conversation so far. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb). */
        messages: Schemas.ChatCompletionRequestMessage[];
        /** A list of functions the model may generate JSON inputs for. */
        functions?: Schemas.ChatCompletionFunctions[];
        /** Controls how the model responds to function calls. "none" means the model does not call a function, and responds to the end-user. "auto" means the model can pick between an end-user or calling a function.  Specifying a particular function via `{"name":\ "my_function"}` forces the model to call that function. "none" is the default when no functions are present. "auto" is the default if functions are present. */
        function_call?: ("none" | "auto") | {
            /** The name of the function to call. */
            name: string;
        };
        /**
         * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
         *
         * We generally recommend altering this or `top_p` but not both.
         */
        temperature?: number | null;
        /**
         * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
         *
         * We generally recommend altering this or `temperature` but not both.
         */
        top_p?: number | null;
        /** How many chat completion choices to generate for each input message. */
        n?: number | null;
        /** If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb). */
        stream?: boolean | null;
        /** Up to 4 sequences where the API will stop generating further tokens. */
        stop?: (string | null) | string[];
        /**
         * The maximum number of [tokens](/tokenizer) to generate in the chat completion.
         *
         * The total length of input tokens and generated tokens is limited by the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.
         */
        max_tokens?: number;
        /**
         * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
         *
         * [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
         */
        presence_penalty?: number | null;
        /**
         * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
         *
         * [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
         */
        frequency_penalty?: number | null;
        /**
         * Modify the likelihood of specified tokens appearing in the completion.
         *
         * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
         */
        logit_bias?: {} | null;
        /** A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids). */
        user?: string;
    }
    interface CreateChatCompletionResponse {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: {
            index?: number;
            message?: Schemas.ChatCompletionResponseMessage;
            finish_reason?: "stop" | "length" | "function_call";
        }[];
        usage?: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
    }
    interface CreateChatCompletionStreamResponse {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: {
            index?: number;
            delta?: Schemas.ChatCompletionStreamResponseDelta;
            finish_reason?: "stop" | "length" | "function_call";
        }[];
    }
    interface CreateEditRequest {
        /** ID of the model to use. You can use the `text-davinci-edit-001` or `code-davinci-edit-001` model with this endpoint. */
        model: string | ("text-davinci-edit-001" | "code-davinci-edit-001");
        /** The input text to use as a starting point for the edit. */
        input?: string | null;
        /** The instruction that tells the model how to edit the prompt. */
        instruction: string;
        /** How many edits to generate for the input and instruction. */
        n?: number | null;
        /**
         * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
         *
         * We generally recommend altering this or `top_p` but not both.
         */
        temperature?: number | null;
        /**
         * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
         *
         * We generally recommend altering this or `temperature` but not both.
         */
        top_p?: number | null;
    }
    interface CreateEditResponse {
        object: string;
        created: number;
        choices: {
            text?: string;
            index?: number;
            logprobs?: {
                tokens?: string[];
                token_logprobs?: number[];
                top_logprobs?: {}[];
                text_offset?: number[];
            } | null;
            finish_reason?: "stop" | "length";
        }[];
        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
    }
    interface CreateImageRequest {
        /** A text description of the desired image(s). The maximum length is 1000 characters. */
        prompt: string;
        /** The number of images to generate. Must be between 1 and 10. */
        n?: number | null;
        /** The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`. */
        size?: ("256x256" | "512x512" | "1024x1024") | null;
        /** The format in which the generated images are returned. Must be one of `url` or `b64_json`. */
        response_format?: ("url" | "b64_json") | null;
        /** A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids). */
        user?: string;
    }
    interface ImagesResponse {
        created: number;
        data: {
            url?: string;
            b64_json?: string;
        }[];
    }
    interface CreateImageEditRequest {
        /** The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask. */
        image: string | BlobWithFilename;
        /** An additional image whose fully transparent areas (e.g. where alpha is zero) indicate where `image` should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as `image`. */
        mask?: string | BlobWithFilename;
        /** A text description of the desired image(s). The maximum length is 1000 characters. */
        prompt: string;
        /** The number of images to generate. Must be between 1 and 10. */
        n?: number | null;
        /** The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`. */
        size?: ("256x256" | "512x512" | "1024x1024") | null;
        /** The format in which the generated images are returned. Must be one of `url` or `b64_json`. */
        response_format?: ("url" | "b64_json") | null;
        /** A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids). */
        user?: string;
    }
    interface CreateImageVariationRequest {
        /** The image to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square. */
        image: string | BlobWithFilename;
        /** The number of images to generate. Must be between 1 and 10. */
        n?: number | null;
        /** The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`. */
        size?: ("256x256" | "512x512" | "1024x1024") | null;
        /** The format in which the generated images are returned. Must be one of `url` or `b64_json`. */
        response_format?: ("url" | "b64_json") | null;
        /** A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids). */
        user?: string;
    }
    interface CreateModerationRequest {
        /** The input text to classify */
        input: string | string[];
        /**
         * Two content moderations models are available: `text-moderation-stable` and `text-moderation-latest`.
         *
         * The default is `text-moderation-latest` which will be automatically upgraded over time. This ensures you are always using our most accurate model. If you use `text-moderation-stable`, we will provide advanced notice before updating the model. Accuracy of `text-moderation-stable` may be slightly lower than for `text-moderation-latest`.
         */
        model?: string | ("text-moderation-latest" | "text-moderation-stable");
    }
    interface CreateModerationResponse {
        id: string;
        model: string;
        results: {
            flagged: boolean;
            categories: {
                hate: boolean;
                "hate/threatening": boolean;
                "self-harm": boolean;
                sexual: boolean;
                "sexual/minors": boolean;
                violence: boolean;
                "violence/graphic": boolean;
            };
            category_scores: {
                hate: number;
                "hate/threatening": number;
                "self-harm": number;
                sexual: number;
                "sexual/minors": number;
                violence: number;
                "violence/graphic": number;
            };
        }[];
    }
    interface ListFilesResponse {
        object: string;
        data: Schemas.OpenAIFile[];
    }
    interface CreateFileRequest {
        /**
         * Name of the [JSON Lines](https://jsonlines.readthedocs.io/en/latest/) file to be uploaded.
         *
         * If the `purpose` is set to "fine-tune", each line is a JSON record with "prompt" and "completion" fields representing your [training examples](/docs/guides/fine-tuning/prepare-training-data).
         */
        file: string | BlobWithFilename;
        /**
         * The intended purpose of the uploaded documents.
         *
         * Use "fine-tune" for [Fine-tuning](/docs/api-reference/fine-tunes). This allows us to validate the format of the uploaded file.
         */
        purpose: string;
    }
    interface DeleteFileResponse {
        id: string;
        object: string;
        deleted: boolean;
    }
    interface CreateFineTuneRequest {
        /**
         * The ID of an uploaded file that contains training data.
         *
         * See [upload file](/docs/api-reference/files/upload) for how to upload a file.
         *
         * Your dataset must be formatted as a JSONL file, where each training
         * example is a JSON object with the keys "prompt" and "completion".
         * Additionally, you must upload your file with the purpose `fine-tune`.
         *
         * See the [fine-tuning guide](/docs/guides/fine-tuning/creating-training-data) for more details.
         */
        training_file: string;
        /**
         * The ID of an uploaded file that contains validation data.
         *
         * If you provide this file, the data is used to generate validation
         * metrics periodically during fine-tuning. These metrics can be viewed in
         * the [fine-tuning results file](/docs/guides/fine-tuning/analyzing-your-fine-tuned-model).
         * Your train and validation data should be mutually exclusive.
         *
         * Your dataset must be formatted as a JSONL file, where each validation
         * example is a JSON object with the keys "prompt" and "completion".
         * Additionally, you must upload your file with the purpose `fine-tune`.
         *
         * See the [fine-tuning guide](/docs/guides/fine-tuning/creating-training-data) for more details.
         */
        validation_file?: string | null;
        /**
         * The name of the base model to fine-tune. You can select one of "ada",
         * "babbage", "curie", "davinci", or a fine-tuned model created after 2022-04-21.
         * To learn more about these models, see the
         * [Models](https://platform.openai.com/docs/models) documentation.
         */
        model?: (string | ("ada" | "babbage" | "curie" | "davinci")) | null;
        /**
         * The number of epochs to train the model for. An epoch refers to one
         * full cycle through the training dataset.
         */
        n_epochs?: number | null;
        /**
         * The batch size to use for training. The batch size is the number of
         * training examples used to train a single forward and backward pass.
         *
         * By default, the batch size will be dynamically configured to be
         * ~0.2% of the number of examples in the training set, capped at 256 -
         * in general, we've found that larger batch sizes tend to work better
         * for larger datasets.
         */
        batch_size?: number | null;
        /**
         * The learning rate multiplier to use for training.
         * The fine-tuning learning rate is the original learning rate used for
         * pretraining multiplied by this value.
         *
         * By default, the learning rate multiplier is the 0.05, 0.1, or 0.2
         * depending on final `batch_size` (larger learning rates tend to
         * perform better with larger batch sizes). We recommend experimenting
         * with values in the range 0.02 to 0.2 to see what produces the best
         * results.
         */
        learning_rate_multiplier?: number | null;
        /**
         * The weight to use for loss on the prompt tokens. This controls how
         * much the model tries to learn to generate the prompt (as compared
         * to the completion which always has a weight of 1.0), and can add
         * a stabilizing effect to training when completions are short.
         *
         * If prompts are extremely long (relative to completions), it may make
         * sense to reduce this weight so as to avoid over-prioritizing
         * learning the prompt.
         */
        prompt_loss_weight?: number | null;
        /**
         * If set, we calculate classification-specific metrics such as accuracy
         * and F-1 score using the validation set at the end of every epoch.
         * These metrics can be viewed in the [results file](/docs/guides/fine-tuning/analyzing-your-fine-tuned-model).
         *
         * In order to compute classification metrics, you must provide a
         * `validation_file`. Additionally, you must
         * specify `classification_n_classes` for multiclass classification or
         * `classification_positive_class` for binary classification.
         */
        compute_classification_metrics?: boolean | null;
        /**
         * The number of classes in a classification task.
         *
         * This parameter is required for multiclass classification.
         */
        classification_n_classes?: number | null;
        /**
         * The positive class in binary classification.
         *
         * This parameter is needed to generate precision, recall, and F1
         * metrics when doing binary classification.
         */
        classification_positive_class?: string | null;
        /**
         * If this is provided, we calculate F-beta scores at the specified
         * beta values. The F-beta score is a generalization of F-1 score.
         * This is only used for binary classification.
         *
         * With a beta of 1 (i.e. the F-1 score), precision and recall are
         * given the same weight. A larger beta score puts more weight on
         * recall and less on precision. A smaller beta score puts more weight
         * on precision and less on recall.
         */
        classification_betas?: number[] | null;
        /**
         * A string of up to 40 characters that will be added to your fine-tuned model name.
         *
         * For example, a `suffix` of "custom-model-name" would produce a model name like `ada:ft-your-org:custom-model-name-2022-02-15-04-21-04`.
         */
        suffix?: string | null;
    }
    interface ListFineTunesResponse {
        object: string;
        data: Schemas.FineTune[];
    }
    interface ListFineTuneEventsResponse {
        object: string;
        data: Schemas.FineTuneEvent[];
    }
    interface CreateEmbeddingRequest {
        /** ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them. */
        model: string | ("text-embedding-ada-002");
        /** Input text to embed, encoded as a string or array of tokens. To embed multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed the max input tokens for the model (8191 tokens for `text-embedding-ada-002`). [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens. */
        input: string | string[] | number[] | number[][];
        /** A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids). */
        user?: string;
    }
    interface CreateEmbeddingResponse {
        object: string;
        model: string;
        data: {
            index: number;
            object: string;
            embedding: number[];
        }[];
        usage: {
            prompt_tokens: number;
            total_tokens: number;
        };
    }
    interface CreateTranscriptionRequest {
        /** The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm. */
        file: string | BlobWithFilename;
        /** ID of the model to use. Only `whisper-1` is currently available. */
        model: string | ("whisper-1");
        /** An optional text to guide the model's style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language. */
        prompt?: string;
        /** The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt. */
        response_format?: string;
        /** The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit. */
        temperature?: number;
        /** The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency. */
        language?: string;
    }
    interface CreateTranscriptionResponse {
        text: string;
    }
    interface CreateTranslationRequest {
        /** The audio file object (not file name) translate, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm. */
        file: string | BlobWithFilename;
        /** ID of the model to use. Only `whisper-1` is currently available. */
        model: string | ("whisper-1");
        /** An optional text to guide the model's style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should be in English. */
        prompt?: string;
        /** The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt. */
        response_format?: string;
        /** The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit. */
        temperature?: number;
    }
    interface CreateTranslationResponse {
        text: string;
    }
    interface Model {
        id: string;
        object: string;
        created: number;
        owned_by: string;
    }
    interface OpenAIFile {
        id: string;
        object: string;
        bytes: number;
        created_at: number;
        filename: string;
        purpose: string;
        status?: string;
        status_details?: {} | null;
    }
    interface FineTune {
        id: string;
        object: string;
        created_at: number;
        updated_at: number;
        model: string;
        fine_tuned_model: string | null;
        organization_id: string;
        status: string;
        hyperparams: {};
        training_files: Schemas.OpenAIFile[];
        validation_files: Schemas.OpenAIFile[];
        result_files: Schemas.OpenAIFile[];
        events?: Schemas.FineTuneEvent[];
    }
    interface FineTuneEvent {
        object: string;
        created_at: number;
        level: string;
        message: string;
    }
}
export interface RequestBody$createChatCompletion {
    "application/json": Schemas.CreateChatCompletionRequest;
}
export interface Response$createChatCompletion$Status$200 {
    "application/json": Schemas.CreateChatCompletionResponse;
}
export interface RequestBody$createCompletion {
    "application/json": Schemas.CreateCompletionRequest;
}
export interface Response$createCompletion$Status$200 {
    "application/json": Schemas.CreateCompletionResponse;
}
export interface RequestBody$createEdit {
    "application/json": Schemas.CreateEditRequest;
}
export interface Response$createEdit$Status$200 {
    "application/json": Schemas.CreateEditResponse;
}
export interface RequestBody$createImage {
    "application/json": Schemas.CreateImageRequest;
}
export interface Response$createImage$Status$200 {
    "application/json": Schemas.ImagesResponse;
}
export interface RequestBody$createImageEdit {
    "multipart/form-data": Schemas.CreateImageEditRequest;
}
export interface Response$createImageEdit$Status$200 {
    "application/json": Schemas.ImagesResponse;
}
export interface RequestBody$createImageVariation {
    "multipart/form-data": Schemas.CreateImageVariationRequest;
}
export interface Response$createImageVariation$Status$200 {
    "application/json": Schemas.ImagesResponse;
}
export interface RequestBody$createEmbedding {
    "application/json": Schemas.CreateEmbeddingRequest;
}
export interface Response$createEmbedding$Status$200 {
    "application/json": Schemas.CreateEmbeddingResponse;
}
export interface RequestBody$createTranscription {
    "multipart/form-data": Schemas.CreateTranscriptionRequest;
}
export interface Response$createTranscription$Status$200 {
    "application/json": Schemas.CreateTranscriptionResponse;
}
export interface RequestBody$createTranslation {
    "multipart/form-data": Schemas.CreateTranslationRequest;
}
export interface Response$createTranslation$Status$200 {
    "application/json": Schemas.CreateTranslationResponse;
}
export interface Response$listFiles$Status$200 {
    "application/json": Schemas.ListFilesResponse;
}
export interface RequestBody$createFile {
    "multipart/form-data": Schemas.CreateFileRequest;
}
export interface Response$createFile$Status$200 {
    "application/json": Schemas.OpenAIFile;
}
export interface Parameter$retrieveFile {
    /** The ID of the file to use for this request */
    file_id: string;
}
export interface Response$retrieveFile$Status$200 {
    "application/json": Schemas.OpenAIFile;
}
export interface Parameter$deleteFile {
    /** The ID of the file to use for this request */
    file_id: string;
}
export interface Response$deleteFile$Status$200 {
    "application/json": Schemas.DeleteFileResponse;
}
export interface Parameter$downloadFile {
    /** The ID of the file to use for this request */
    file_id: string;
}
export interface Response$downloadFile$Status$200 {
    "application/json": string;
}
export interface Response$listFineTunes$Status$200 {
    "application/json": Schemas.ListFineTunesResponse;
}
export interface RequestBody$createFineTune {
    "application/json": Schemas.CreateFineTuneRequest;
}
export interface Response$createFineTune$Status$200 {
    "application/json": Schemas.FineTune;
}
export interface Parameter$retrieveFineTune {
    /** The ID of the fine-tune job */
    fine_tune_id: string;
}
export interface Response$retrieveFineTune$Status$200 {
    "application/json": Schemas.FineTune;
}
export interface Parameter$cancelFineTune {
    /** The ID of the fine-tune job to cancel */
    fine_tune_id: string;
}
export interface Response$cancelFineTune$Status$200 {
    "application/json": Schemas.FineTune;
}
export interface Parameter$listFineTuneEvents {
    /** The ID of the fine-tune job to get events for. */
    fine_tune_id: string;
    /**
     * Whether to stream events for the fine-tune job. If set to true,
     * events will be sent as data-only
     * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
     * as they become available. The stream will terminate with a
     * `data: [DONE]` message when the job is finished (succeeded, cancelled,
     * or failed).
     *
     * If set to false, only events generated so far will be returned.
     */
    stream?: boolean;
}
export interface Response$listFineTuneEvents$Status$200 {
    "application/json": Schemas.ListFineTuneEventsResponse;
}
export interface Response$listModels$Status$200 {
    "application/json": Schemas.ListModelsResponse;
}
export interface Parameter$retrieveModel {
    /** The ID of the model to use for this request */
    model: string;
}
export interface Response$retrieveModel$Status$200 {
    "application/json": Schemas.Model;
}
export interface Parameter$deleteModel {
    /** The model to delete */
    model: string;
}
export interface Response$deleteModel$Status$200 {
    "application/json": Schemas.DeleteModelResponse;
}
export interface RequestBody$createModeration {
    "application/json": Schemas.CreateModerationRequest;
}
export interface Response$createModeration$Status$200 {
    "application/json": Schemas.CreateModerationResponse;
}
export type RequestContentType$createChatCompletion = keyof RequestBody$createChatCompletion;
export type ResponseContentType$createChatCompletion = keyof Response$createChatCompletion$Status$200;
export interface Params$createChatCompletion {
    requestBody: RequestBody$createChatCompletion["application/json"];
}
export type RequestContentType$createCompletion = keyof RequestBody$createCompletion;
export type ResponseContentType$createCompletion = keyof Response$createCompletion$Status$200;
export interface Params$createCompletion {
    requestBody: RequestBody$createCompletion["application/json"];
}
export type RequestContentType$createEdit = keyof RequestBody$createEdit;
export type ResponseContentType$createEdit = keyof Response$createEdit$Status$200;
export interface Params$createEdit {
    requestBody: RequestBody$createEdit["application/json"];
}
export type RequestContentType$createImage = keyof RequestBody$createImage;
export type ResponseContentType$createImage = keyof Response$createImage$Status$200;
export interface Params$createImage {
    requestBody: RequestBody$createImage["application/json"];
}
export type RequestContentType$createImageEdit = keyof RequestBody$createImageEdit;
export type ResponseContentType$createImageEdit = keyof Response$createImageEdit$Status$200;
export interface Params$createImageEdit {
    requestBody: RequestBody$createImageEdit["multipart/form-data"];
}
export type RequestContentType$createImageVariation = keyof RequestBody$createImageVariation;
export type ResponseContentType$createImageVariation = keyof Response$createImageVariation$Status$200;
export interface Params$createImageVariation {
    requestBody: RequestBody$createImageVariation["multipart/form-data"];
}
export type RequestContentType$createEmbedding = keyof RequestBody$createEmbedding;
export type ResponseContentType$createEmbedding = keyof Response$createEmbedding$Status$200;
export interface Params$createEmbedding {
    requestBody: RequestBody$createEmbedding["application/json"];
}
export type RequestContentType$createTranscription = keyof RequestBody$createTranscription;
export type ResponseContentType$createTranscription = keyof Response$createTranscription$Status$200;
export interface Params$createTranscription {
    requestBody: RequestBody$createTranscription["multipart/form-data"];
}
export type RequestContentType$createTranslation = keyof RequestBody$createTranslation;
export type ResponseContentType$createTranslation = keyof Response$createTranslation$Status$200;
export interface Params$createTranslation {
    requestBody: RequestBody$createTranslation["multipart/form-data"];
}
export type ResponseContentType$listFiles = keyof Response$listFiles$Status$200;
export type RequestContentType$createFile = keyof RequestBody$createFile;
export type ResponseContentType$createFile = keyof Response$createFile$Status$200;
export interface Params$createFile {
    requestBody: RequestBody$createFile["multipart/form-data"];
}
export type ResponseContentType$retrieveFile = keyof Response$retrieveFile$Status$200;
export interface Params$retrieveFile {
    parameter: Parameter$retrieveFile;
}
export type ResponseContentType$deleteFile = keyof Response$deleteFile$Status$200;
export interface Params$deleteFile {
    parameter: Parameter$deleteFile;
}
export type ResponseContentType$downloadFile = keyof Response$downloadFile$Status$200;
export interface Params$downloadFile {
    parameter: Parameter$downloadFile;
}
export type ResponseContentType$listFineTunes = keyof Response$listFineTunes$Status$200;
export type RequestContentType$createFineTune = keyof RequestBody$createFineTune;
export type ResponseContentType$createFineTune = keyof Response$createFineTune$Status$200;
export interface Params$createFineTune {
    requestBody: RequestBody$createFineTune["application/json"];
}
export type ResponseContentType$retrieveFineTune = keyof Response$retrieveFineTune$Status$200;
export interface Params$retrieveFineTune {
    parameter: Parameter$retrieveFineTune;
}
export type ResponseContentType$cancelFineTune = keyof Response$cancelFineTune$Status$200;
export interface Params$cancelFineTune {
    parameter: Parameter$cancelFineTune;
}
export type ResponseContentType$listFineTuneEvents = keyof Response$listFineTuneEvents$Status$200;
export interface Params$listFineTuneEvents {
    parameter: Parameter$listFineTuneEvents;
}
export type ResponseContentType$listModels = keyof Response$listModels$Status$200;
export type ResponseContentType$retrieveModel = keyof Response$retrieveModel$Status$200;
export interface Params$retrieveModel {
    parameter: Parameter$retrieveModel;
}
export type ResponseContentType$deleteModel = keyof Response$deleteModel$Status$200;
export interface Params$deleteModel {
    parameter: Parameter$deleteModel;
}
export type RequestContentType$createModeration = keyof RequestBody$createModeration;
export type ResponseContentType$createModeration = keyof Response$createModeration$Status$200;
export interface Params$createModeration {
    requestBody: RequestBody$createModeration["application/json"];
}
export type HttpMethod = "GET" | "PUT" | "POST" | "DELETE" | "OPTIONS" | "HEAD" | "PATCH" | "TRACE";
export interface ObjectLike {
    [key: string]: any;
}
export interface QueryParameter {
    value: any;
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode: boolean;
}
export interface QueryParameters {
    [key: string]: QueryParameter;
}
export type SuccessResponses = Response$createChatCompletion$Status$200 | Response$createCompletion$Status$200 | Response$createEdit$Status$200 | Response$createImage$Status$200 | Response$createImageEdit$Status$200 | Response$createImageVariation$Status$200 | Response$createEmbedding$Status$200 | Response$createTranscription$Status$200 | Response$createTranslation$Status$200 | Response$listFiles$Status$200 | Response$createFile$Status$200 | Response$retrieveFile$Status$200 | Response$deleteFile$Status$200 | Response$downloadFile$Status$200 | Response$listFineTunes$Status$200 | Response$createFineTune$Status$200 | Response$retrieveFineTune$Status$200 | Response$cancelFineTune$Status$200 | Response$listFineTuneEvents$Status$200 | Response$listModels$Status$200 | Response$retrieveModel$Status$200 | Response$deleteModel$Status$200 | Response$createModeration$Status$200;
export declare namespace ErrorResponse {
    type createChatCompletion = void;
    type createCompletion = void;
    type createEdit = void;
    type createImage = void;
    type createImageEdit = void;
    type createImageVariation = void;
    type createEmbedding = void;
    type createTranscription = void;
    type createTranslation = void;
    type listFiles = void;
    type createFile = void;
    type retrieveFile = void;
    type deleteFile = void;
    type downloadFile = void;
    type listFineTunes = void;
    type createFineTune = void;
    type retrieveFineTune = void;
    type cancelFineTune = void;
    type listFineTuneEvents = void;
    type listModels = void;
    type retrieveModel = void;
    type deleteModel = void;
    type createModeration = void;
}
export interface Encoding {
    contentType?: string;
    headers?: Record<string, any>;
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode?: boolean;
    allowReserved?: boolean;
}
export interface RequestArgs {
    httpMethod: HttpMethod;
    url: string;
    headers: ObjectLike | any;
    requestBody?: ObjectLike | any;
    requestBodyEncoding?: Record<string, Encoding>;
    queryParameters?: QueryParameters | undefined;
}
export interface ApiClient<RequestOption> {
    request: <T = SuccessResponses>(requestArgs: RequestArgs, options?: RequestOption) => Promise<T>;
}
export declare class Client<RequestOption> {
    private apiClient;
    private baseUrl;
    constructor(apiClient: ApiClient<RequestOption>, baseUrl: string);
    /** Creates a model response for the given chat conversation. */
    createChatCompletion(params: Params$createChatCompletion, option?: RequestOption): Promise<Response$createChatCompletion$Status$200["application/json"]>;
    /** Creates a completion for the provided prompt and parameters. */
    createCompletion(params: Params$createCompletion, option?: RequestOption): Promise<Response$createCompletion$Status$200["application/json"]>;
    /** Creates a new edit for the provided input, instruction, and parameters. */
    createEdit(params: Params$createEdit, option?: RequestOption): Promise<Response$createEdit$Status$200["application/json"]>;
    /** Creates an image given a prompt. */
    createImage(params: Params$createImage, option?: RequestOption): Promise<Response$createImage$Status$200["application/json"]>;
    /** Creates an edited or extended image given an original image and a prompt. */
    createImageEdit(params: Params$createImageEdit, option?: RequestOption): Promise<Response$createImageEdit$Status$200["application/json"]>;
    /** Creates a variation of a given image. */
    createImageVariation(params: Params$createImageVariation, option?: RequestOption): Promise<Response$createImageVariation$Status$200["application/json"]>;
    /** Creates an embedding vector representing the input text. */
    createEmbedding(params: Params$createEmbedding, option?: RequestOption): Promise<Response$createEmbedding$Status$200["application/json"]>;
    /** Transcribes audio into the input language. */
    createTranscription(params: Params$createTranscription, option?: RequestOption): Promise<Response$createTranscription$Status$200["application/json"]>;
    /** Translates audio into English. */
    createTranslation(params: Params$createTranslation, option?: RequestOption): Promise<Response$createTranslation$Status$200["application/json"]>;
    /** Returns a list of files that belong to the user's organization. */
    listFiles(option?: RequestOption): Promise<Response$listFiles$Status$200["application/json"]>;
    /** Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact us if you need to increase the storage limit. */
    createFile(params: Params$createFile, option?: RequestOption): Promise<Response$createFile$Status$200["application/json"]>;
    /** Returns information about a specific file. */
    retrieveFile(params: Params$retrieveFile, option?: RequestOption): Promise<Response$retrieveFile$Status$200["application/json"]>;
    /** Delete a file. */
    deleteFile(params: Params$deleteFile, option?: RequestOption): Promise<Response$deleteFile$Status$200["application/json"]>;
    /** Returns the contents of the specified file */
    downloadFile(params: Params$downloadFile, option?: RequestOption): Promise<Response$downloadFile$Status$200["application/json"]>;
    /** List your organization's fine-tuning jobs */
    listFineTunes(option?: RequestOption): Promise<Response$listFineTunes$Status$200["application/json"]>;
    /**
     * Creates a job that fine-tunes a specified model from a given dataset.
     *
     * Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.
     *
     * [Learn more about Fine-tuning](/docs/guides/fine-tuning)
     */
    createFineTune(params: Params$createFineTune, option?: RequestOption): Promise<Response$createFineTune$Status$200["application/json"]>;
    /**
     * Gets info about the fine-tune job.
     *
     * [Learn more about Fine-tuning](/docs/guides/fine-tuning)
     */
    retrieveFineTune(params: Params$retrieveFineTune, option?: RequestOption): Promise<Response$retrieveFineTune$Status$200["application/json"]>;
    /** Immediately cancel a fine-tune job. */
    cancelFineTune(params: Params$cancelFineTune, option?: RequestOption): Promise<Response$cancelFineTune$Status$200["application/json"]>;
    /** Get fine-grained status updates for a fine-tune job. */
    listFineTuneEvents(params: Params$listFineTuneEvents, option?: RequestOption): Promise<Response$listFineTuneEvents$Status$200["application/json"]>;
    /** Lists the currently available models, and provides basic information about each one such as the owner and availability. */
    listModels(option?: RequestOption): Promise<Response$listModels$Status$200["application/json"]>;
    /** Retrieves a model instance, providing basic information about the model such as the owner and permissioning. */
    retrieveModel(params: Params$retrieveModel, option?: RequestOption): Promise<Response$retrieveModel$Status$200["application/json"]>;
    /** Delete a fine-tuned model. You must have the Owner role in your organization. */
    deleteModel(params: Params$deleteModel, option?: RequestOption): Promise<Response$deleteModel$Status$200["application/json"]>;
    /** Classifies if text violates OpenAI's Content Policy */
    createModeration(params: Params$createModeration, option?: RequestOption): Promise<Response$createModeration$Status$200["application/json"]>;
}
export declare class BlobWithFilename extends Blob {
    filename: string;
    constructor(blobPart: BlobPart[], type: string, filename: string);
}
