// vendored from https://github.com/nginx/njs/tree/3e02ae0fae030cd802075f42b7037fe3df96e2f6/ts

type NgxHeaders = Headers | Object | [NjsFixedSizeArray<2, string>];

declare class Headers {
    /**
     * Appends a new value into an existing header in the Headers object,
     * or adds the header if it does not already exist.
     * @param name A name of the header.
     * @param value A value of the header.
     * @since 0.7.10
     */
    append(name:string, value: string): void;
    /**
     * Headers constructors.
     *
     * @param init is an optional initialization object.
     * @returns returns Headers object.
     * @since 0.7.10
     */
    constructor(init?: Object | [NjsFixedSizeArray<2, string>]);
    /**
     * Deletes a header from the Headers object.
     * @param name A name of the header to be deleted.
     * @since 0.7.10
     */
    delete(name:string): void;
    /**
     * Returns a string containing the values of all headers
     * with the specified name separated by a comma and a space.
     * @param name A name of the header.
     */
    get(name:string): string;
    /**
     * Returns an array containing the values of all headers
     * with the specified name.
     * @param name A name of the header.
     */
    getAll(name:string): Array<string>;
    /**
     * Executes a provided function once for each key/value
     * pair in the Headers object.
     * @param fn the function to be envoked.
     * @since 0.7.10
     */
    forEach(fn:(name: string, value: string) => void): void;
    /**
     * Returns a boolean value indicating whether a header with
     * the specified name exists.
     * @param name A name of the header.
     */
    has(name:string): boolean;
    /**
     * Sets a new value for an existing header inside the Headers object,
     * or adds the header if it does not already exist.
     * @param name A name of the header.
     * @param value A value of the header.
     * @since 0.7.10
     */
    set(name:string, value: string): void;
}

interface NgxRequestOptions {
    /**
     * Request body, by default is empty.
     */
    body?: string;
    /**
     * Cache mode, by default is "default".
     */
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
    /**
     * Credentials, by default is "same-origin".
     */
    credentials?: "omit" | "same-origin" | "include";
    /**
     * Request headers.
     */
    headers?: NgxHeaders;
    /**
     * Request method, by default the GET method is used.
     */
    method?: string;
    /**
     * Mode, by default is "no-cors".
     */
    mode?: "same-origin" | "no-cors" | "cors";
}

declare class Request {
    /**
     * Returns a Promise that resolves with an body as ArrayBuffer.
     */
    arrayBuffer(): Promise<ArrayBuffer>;
    /**
     * A boolean value, true if the body has been used.
     */
    readonly bodyUsed: boolean;
    /**
     * Cache mode.
     */
    readonly cache: string;
    /**
     * Request constructors.
     *
     * @param init is an optional initialization object.
     * @returns returns Request object.
     * @since 0.7.10
     */
    constructor(input: string | Request, options?: NgxRequestOptions);
    /**
     * Credentials.
     */
    readonly credentials: string;
    /**
     * Returns a Promise that resolves with an result of applying of
     * JSON.parse() to a body.
     */
    json(): Promise<Object>;
    /**
     * The Headers object associated with the request.
     */
    headers: Headers;
    /**
     * Request mode.
     */
    readonly mode: string;
    /**
     * Returns a Promise that resolves with an body as String.
     */
    text(): Promise<string>;
    /**
     * Request url.
     */
    readonly url: string;
}

interface NgxResponseOptions {
    /**
     * Request headers.
     */
    headers?: NgxHeaders;
    /**
     * Response status, 200 by default.
     */
    status?: number;
    /**
     * Response status test, '' by default.
     */
    statusText?: string;
}

declare class Response {
    /**
     * Takes a Response stream and reads it to completion.
     * Returns a Promise that resolves with an ArrayBuffer.
     */
    arrayBuffer(): Promise<ArrayBuffer>;
    /**
     * A boolean value, true if the body has been used.
     */
    readonly bodyUsed: boolean;
    /**
     * Response constructors.
     *
     * @param init is an optional initialization object.
     * @returns returns Response object.
     * @since 0.7.10
     */
    constructor(body?: string, options?: NgxResponseOptions);
    /**
     * Takes a Response stream and reads it to completion.
     * Returns a Promise that resolves with the result of
     * parsing the body text as JSON.
     */
    json(): Promise<Object>;
    /**
     * The Headers object associated with the response.
     */
    headers: Headers;
    /**
     * A boolean value, true if the response was successful
     * (status in the range 200-299).
     */
    readonly ok: boolean;
    /**
     * A boolean value, true if the response is the result
     * of a redirect.
     */
    readonly redirected: boolean;
    /**
     * The status code of the response.
     */
    readonly status: number;
    /**
     * The status message corresponding to the status code.
     */
    readonly statusText: string;
    /**
     * Takes a Response stream and reads it to completion.
     * Returns a Promise that resolves with a string.
     */
    text(): Promise<string>;
    /**
     * The type of the response.
     */
    readonly type: string;
    /**
     * Response url.
     */
    readonly url: string;
}

interface NgxFetchOptions {
    /**
     * Request body, by default is empty.
     */
    body?: string,
    /**
     * The buffer size for reading the response, by default is 16384 (4096 before 0.7.4).
     * Nginx specific.
     * @deprecated Use `js_fetch_buffer_size` directive instead.
     */
    buffer_size?: Number,
    /**
     * Request headers object.
     */
    headers?: NgxHeaders;
    /**
     * The maximum size of the response body in bytes, by default is 1048576 (32768 before 0.7.4).
     * Nginx specific.
     * @deprecated Use `js_fetch_max_response_buffer_size` directive instead.
     */
    max_response_body_size?: Number,
    /**
     * Request method, by default the GET method is used.
     */
    method?: string;
    /**
     * Enables or disables verification of the HTTPS server certificate,
     * by default is true.
     * @since 0.7.0
     */
    verify?: boolean;
}

/**
 * This Error object is thrown when adding an item to a shared dictionary
 * that does not have enough free space.
 * @since 0.8.0
 */
declare class SharedMemoryError extends Error {}

type NgxSharedDictValue = string | number;
type NgxKeyValuePair<V> = [string, V];

/**
 * Interface of a dictionary shared among the working processes.
 * It can store either `string` or `number` values which is specified when
 * declaring the zone.
 *
 * @template {V} The type of stored values.
 * @since 0.8.0
 */
interface NgxSharedDict<V extends string | number = string | number> {
    /**
     * The capacity of this shared dictionary in bytes.
     */
    readonly capacity: number;
    /**
     * The name of this shared dictionary.
     */
    readonly name: string;

    /**
     * Sets the `value` for the specified `key` in the dictionary only if the
     * `key` does not exist yet.
     *
     * @param key The key of the item to add.
     * @param value The value of the item to add.
     * @param timeout Overrides the default timeout for this item in milliseconds.
     * @returns `true` if the value has been added successfully, `false`
     *   if the `key` already exists in this dictionary.
     * @throws {SharedMemoryError} if there's not enough free space in this
     *   dictionary.
     * @throws {TypeError} if the `value` is of a different type than expected
     *   by this dictionary.
     */
    add(key: string, value: V, timeout?: number): boolean;
    /**
     * Removes all items from this dictionary.
     */
    clear(): void;
    /**
     * Removes the item associated with the specified `key` from the dictionary.
     *
     * @param key The key of the item to remove.
     * @returns `true` if the item in the dictionary existed and has been
     *   removed, `false` otherwise.
     */
    delete(key: string): boolean;
    /**
     * Increments the value associated with the `key` by the given `delta`.
     * If the `key` doesn't exist, the item will be initialized to `init`.
     *
     * **Important:** This method can be used only if the dictionary was
     * declared with `type=number`!
     *
     * @param key is a string key.
     * @param delta The number to increment/decrement the value by.
     * @param init The number to initialize the item with if it didn't exist
     *   (default is `0`).
     * @param timeout Overrides the default timeout for this item in milliseconds.
     * @returns The new value.
     * @throws {SharedMemoryError} if there's not enough free space in this
     *   dictionary.
     * @throws {TypeError} if this dictionary does not expect numbers.
     */
    incr: V extends number
      ? (key: string, delta: V, init?: number, timeout?: number) => number
      : never;
    /**
     * @param maxCount The maximum number of pairs to retrieve (default is 1024).
     * @returns An array of the key-value pairs.
     */
    items(maxCount?: number): NgxKeyValuePair<V>[];
    /**
     * @returns The free page size in bytes.
     *   Note that even if the free page is zero the dictionary may still accept
     *   new values if there is enough space in the occupied pages.
     */
    freeSpace(): number;
    /**
     * @param key The key of the item to retrieve.
     * @returns The value associated with the `key`, or `undefined` if there
     *   is none.
     */
    get(key: string): V | undefined;
    /**
     * @param key The key to search for.
     * @returns `true` if an item with the specified `key` exists, `false`
     *   otherwise.
     */
    has(key: string): boolean;
    /**
     * @param maxCount The maximum number of keys to retrieve (default is 1024).
     * @returns An array of the dictionary keys.
     */
    keys(maxCount?: number): string[];
    /**
     * Removes the item associated with the specified `key` from the dictionary
     * and returns its value.
     *
     * @param key The key of the item to remove.
     * @returns The value associated with the `key`, or `undefined` if there
     *   is none.
     */
    pop(key: string): V | undefined;
     /**
     * Sets the `value` for the specified `key` in the dictionary only if the
     * `key` already exists.
     *
     * @param key The key of the item to replace.
     * @param value The new value of the item.
     * @returns `true` if the value has been replaced successfully, `false`
     *   if the key doesn't exist in this dictionary.
     * @throws {SharedMemoryError} if there's not enough free space in this
     *   dictionary.
     * @throws {TypeError} if the `value` is of a different type than expected
     *   by this dictionary.
     */
    replace(key: string, value: V): boolean;
    /**
     * Sets the `value` for the specified `key` in the dictionary.
     *
     * @param key The key of the item to set.
     * @param value The value of the item to set.
     * @param timeout Overrides the default timeout for this item in milliseconds.
     * @returns This dictionary (for method chaining).
     * @throws {SharedMemoryError} if there's not enough free space in this
     *   dictionary.
     * @throws {TypeError} if the `value` is of a different type than expected
     *   by this dictionary.
     */
    set(key: string, value: V, timeout?: number): this;
    /**
     * @returns The number of items in this shared dictionary.
     */
    size(): number;
}

interface NgxGlobalShared {
    /**
     * Shared dictionaries.
     * @since 0.8.0
     */
    readonly [prop: string]: NgxSharedDict;
}

interface NgxObject {
    /**
     * A string containing an optional nginx build name, corresponds to the
     * --build=name argument of the configure script, by default is ""
     *  @since 0.8.0
     */
    readonly build: string;
    /**
     * A string containing the file path to current nginx configuration file
     * @since 0.8.0
     */
    readonly conf_file_path: string;
    /**
     * A string containing the file path to directory where nginx is currently
     * looking for configuration
     * @since 0.7.8
     */
    readonly conf_prefix: string;
    /**
     * The error level constant for ngx.log() function.
     * @since 0.5.1
     */
    readonly ERR: number;
    /**
     * A string containing the file path to the current error log file
     * @since 0.8.0
     */
    readonly error_log_path: string;
    /**
     * The info level constant for ngx.log() function.
     * @since 0.5.1
     */
    readonly INFO: number;
    /**
     * Makes a request to fetch an URL.
     * Returns a Promise that resolves with the Response object.
     * Since 0.7.0 HTTPS is supported, redirects are not handled.
     * @param init URL of a resource to fetch or a Request object.
     * @param options An object containing additional settings.
     * @since 0.5.1
     */
    fetch(init: NjsStringOrBuffer | Request, options?: NgxFetchOptions): Promise<Response>;
    /**
     * Writes a string to the error log with the specified level
     * of logging.
     * @param level Log level (ngx.INFO, ngx.WARN, ngx.ERR).
     * @param message Message to log.
     */
    log(level: number, message: NjsStringOrBuffer): void;
    /**
     * A string containing the file path to a directory that keeps server files
     * @since 0.8.0
     */
    readonly prefix: string;

    /**
     * An object containing shared data between all worker processes.
     * @since 0.8.0
     */
    readonly shared: NgxGlobalShared;
    /**
     * A string containing nginx version, for example: "1.25.0"
     * @since 0.8.0
     */
    readonly version: string;
    /**
     * A number containing nginx version, for example: 1025000
     * @since 0.8.0
     */
    readonly version_number: number;
    /**
     * The warn level constant for ngx.log() function.
     * @since 0.5.1
     */
    readonly WARN: number;
    /**
     * A number corresponding to the current worker process id.
     * Can have values from 0 to worker_processes - 1.
     * @since 0.8.0
     */
    readonly worker_id: number;

}

declare const ngx: NgxObject;

interface NginxHTTPArgs {
    readonly [prop: string]: string;
}

interface NginxHeadersIn {
    // common request headers
    readonly 'Accept'?: string;
    readonly 'Accept-Charset'?: string;
    readonly 'Accept-Encoding'?: string;
    readonly 'Accept-Language'?: string;
    readonly 'Authorization'?: string;
    readonly 'Cache-Control'?: string;
    readonly 'Connection'?: string;
    readonly 'Content-Length'?: string;
    readonly 'Content-Type'?: string;
    readonly 'Cookie'?: string;
    readonly 'Date'?: string;
    readonly 'Expect'?: string;
    readonly 'Forwarded'?: string;
    readonly 'From'?: string;
    readonly 'Host'?: string;
    readonly 'If-Match'?: string;
    readonly 'If-Modified-Since'?: string;
    readonly 'If-None-Match'?: string;
    readonly 'If-Range'?: string;
    readonly 'If-Unmodified-Since'?: string;
    readonly 'Max-Forwards'?: string;
    readonly 'Origin'?: string;
    readonly 'Pragma'?: string;
    readonly 'Proxy-Authorization'?: string;
    readonly 'Range'?: string;
    readonly 'Referer'?: string;
    readonly 'TE'?: string;
    readonly 'User-Agent'?: string;
    readonly 'Upgrade'?: string;
    readonly 'Via'?: string;
    readonly 'Warning'?: string;
    readonly 'X-Forwarded-For'?: string;

    readonly [prop: string]: string | undefined;
}

interface NginxHeadersOut {
    // common response headers
    'Age'?: string;
    'Allow'?: string;
    'Alt-Svc'?: string;
    'Cache-Control'?: string;
    'Connection'?: string;
    'Content-Disposition'?: string;
    'Content-Encoding'?: string;
    'Content-Language'?: string;
    'Content-Length'?: string;
    'Content-Location'?: string;
    'Content-Range'?: string;
    'Content-Type'?: string;
    'Date'?: string;
    'ETag'?: string;
    'Expires'?: string;
    'Last-Modified'?: string;
    'Link'?: string;
    'Location'?: string;
    'Pragma'?: string;
    'Proxy-Authenticate'?: string;
    'Retry-After'?: string;
    'Server'?: string;
    'Trailer'?: string;
    'Transfer-Encoding'?: string;
    'Upgrade'?: string;
    'Vary'?: string;
    'Via'?: string;
    'Warning'?: string;
    'WWW-Authenticate'?: string;

    'Set-Cookie'?: string[];

    [prop: string]: string | string[] | undefined;
}

interface NginxVariables {
    readonly 'ancient_browser'?: string;
    readonly 'arg_'?: string;
    readonly 'args'?: string;
    readonly 'binary_remote_addr'?: string;
    readonly 'body_bytes_sent'?: string;
    readonly 'bytes_received'?: string;
    readonly 'bytes_sent'?: string;
    readonly 'connection'?: string;
    readonly 'connection_requests'?: string;
    readonly 'connections_active'?: string;
    readonly 'connections_reading'?: string;
    readonly 'connections_waiting'?: string;
    readonly 'connections_writing'?: string;
    readonly 'content_length'?: string;
    readonly 'content_type'?: string;
    readonly 'cookie_'?: string;
    readonly 'date_gmt'?: string;
    readonly 'date_local'?: string;
    readonly 'document_root'?: string;
    readonly 'document_uri'?: string;
    readonly 'fastcgi_path_info'?: string;
    readonly 'fastcgi_script_name'?: string;
    readonly 'geoip_area_code'?: string;
    readonly 'geoip_city'?: string;
    readonly 'geoip_city_continent_code'?: string;
    readonly 'geoip_city_country_code'?: string;
    readonly 'geoip_city_country_code3'?: string;
    readonly 'geoip_city_country_name'?: string;
    readonly 'geoip_country_code'?: string;
    readonly 'geoip_country_code3'?: string;
    readonly 'geoip_country_name'?: string;
    readonly 'geoip_dma_code'?: string;
    readonly 'geoip_latitude'?: string;
    readonly 'geoip_longitude'?: string;
    readonly 'geoip_org'?: string;
    readonly 'geoip_postal_code'?: string;
    readonly 'geoip_region'?: string;
    readonly 'geoip_region_name'?: string;
    readonly 'gzip_ratio'?: string;
    readonly 'host'?: string;
    readonly 'hostname'?: string;
    readonly 'http2'?: string;
    readonly 'http_'?: string;
    readonly 'https'?: string;
    readonly 'invalid_referer'?: string;
    readonly 'is_args'?: string;
    readonly 'jwt_claim_'?: string;
    readonly 'jwt_header_'?: string;
    readonly 'limit_conn_status'?: string;
    readonly 'limit_rate'?: string;
    readonly 'limit_req_status'?: string;
    readonly 'memcached_key'?: string;
    readonly 'modern_browser'?: string;
    readonly 'msec'?: string;
    readonly 'msie'?: string;
    readonly 'nginx_version'?: string;
    readonly 'pid'?: string;
    readonly 'pipe'?: string;
    readonly 'protocol'?: string;
    readonly 'proxy_add_x_forwarded_for'?: string;
    readonly 'proxy_host'?: string;
    readonly 'proxy_port'?: string;
    readonly 'proxy_protocol_addr'?: string;
    readonly 'proxy_protocol_port'?: string;
    readonly 'proxy_protocol_server_addr'?: string;
    readonly 'proxy_protocol_server_port'?: string;
    readonly 'query_string'?: string;
    readonly 'realip_remote_addr'?: string;
    readonly 'realip_remote_port'?: string;
    readonly 'realpath_root'?: string;
    readonly 'remote_addr'?: string;
    readonly 'remote_port'?: string;
    readonly 'remote_user'?: string;
    readonly 'request'?: string;
    readonly 'request_body'?: string;
    readonly 'request_body_file'?: string;
    readonly 'request_completion'?: string;
    readonly 'request_filename'?: string;
    readonly 'request_id'?: string;
    readonly 'request_length'?: string;
    readonly 'request_method'?: string;
    readonly 'request_time'?: string;
    readonly 'request_uri'?: string;
    readonly 'scheme'?: string;
    readonly 'secure_link'?: string;
    readonly 'secure_link_expires'?: string;
    readonly 'sent_http_'?: string;
    readonly 'sent_trailer_'?: string;
    readonly 'server_addr'?: string;
    readonly 'server_name'?: string;
    readonly 'server_port'?: string;
    readonly 'server_protocol'?: string;
    readonly 'session_log_binary_id'?: string;
    readonly 'session_log_id'?: string;
    readonly 'session_time'?: string;
    readonly 'slice_range'?: string;
    readonly 'spdy'?: string;
    readonly 'spdy_request_priority'?: string;
    readonly 'ssl_cipher'?: string;
    readonly 'ssl_ciphers'?: string;
    readonly 'ssl_client_cert'?: string;
    readonly 'ssl_client_escaped_cert'?: string;
    readonly 'ssl_client_fingerprint'?: string;
    readonly 'ssl_client_i_dn'?: string;
    readonly 'ssl_client_i_dn_legacy'?: string;
    readonly 'ssl_client_raw_cert'?: string;
    readonly 'ssl_client_s_dn'?: string;
    readonly 'ssl_client_s_dn_legacy'?: string;
    readonly 'ssl_client_serial'?: string;
    readonly 'ssl_client_v_end'?: string;
    readonly 'ssl_client_v_remain'?: string;
    readonly 'ssl_client_v_start'?: string;
    readonly 'ssl_client_verify'?: string;
    readonly 'ssl_curves'?: string;
    readonly 'ssl_early_data'?: string;
    readonly 'ssl_preread_alpn_protocols'?: string;
    readonly 'ssl_preread_protocol'?: string;
    readonly 'ssl_preread_server_name'?: string;
    readonly 'ssl_protocol'?: string;
    readonly 'ssl_server_name'?: string;
    readonly 'ssl_session_id'?: string;
    readonly 'ssl_session_reused'?: string;
    readonly 'status'?: string;
    readonly 'tcpinfo_rtt'?: string;
    readonly 'tcpinfo_rttvar'?: string;
    readonly 'tcpinfo_snd_cwnd'?: string;
    readonly 'tcpinfo_rcv_space'?: string;
    readonly 'time_iso8601'?: string;
    readonly 'time_local'?: string;
    readonly 'uid_got'?: string;
    readonly 'uid_reset'?: string;
    readonly 'uid_set'?: string;
    readonly 'upstream_addr'?: string;
    readonly 'upstream_bytes_received'?: string;
    readonly 'upstream_bytes_sent'?: string;
    readonly 'upstream_cache_status'?: string;
    readonly 'upstream_connect_time'?: string;
    readonly 'upstream_cookie_'?: string;
    readonly 'upstream_first_byte_time'?: string;
    readonly 'upstream_header_time'?: string;
    readonly 'upstream_http_'?: string;
    readonly 'upstream_queue_time'?: string;
    readonly 'upstream_response_length'?: string;
    readonly 'upstream_response_time'?: string;
    readonly 'upstream_session_time'?: string;
    readonly 'upstream_status'?: string;
    readonly 'upstream_trailer_'?: string;
    readonly 'uri'?: string;

    [prop: string]: string | undefined;
}

/**
 * @since 0.5.0
 */
type NginxRawVariables = {
    [K in keyof NginxVariables]: Buffer | undefined;
};

interface NginxSubrequestOptions {
    /**
     * Arguments string, by default an empty string is used.
     */
    args?: string,
    /**
     * Request body, by default the request body of the parent request object is used.
     */
    body?: string,
    /**
     * HTTP method, by default the GET method is used.
     */
    method?: "GET" | "POST" | "OPTIONS" | "HEAD" | "PROPFIND" | "PUT"
        | "MKCOL" | "DELETE" | "COPY" | "MOVE" | "PROPPATCH"
        | "LOCK" | "PATCH" | "TRACE",
    /**
     * if true, the created subrequest is a detached subrequest.
     * Responses to detached subrequests are ignored.
     */
    detached?: boolean
}

interface NginxHTTPSendBufferOptions {
    /**
     * True if data is a last buffer.
     */
    last?: boolean
    /**
     * True if the buffer should have the flush flag.
     */
    flush?: boolean
}

/**
 * @since 0.9.9
 */
interface NginxHTTPRequestFormFile {
    readonly name: string;
}

type NginxHTTPRequestFormValue = string | NginxHTTPRequestFormFile;

interface NginxHTTPRequestForm {
    get(name: NjsStringOrBuffer): NginxHTTPRequestFormValue | null;
    getAll(name: NjsStringOrBuffer): NginxHTTPRequestFormValue[];
    has(name: NjsStringOrBuffer): boolean;
    forEach(callback: (value: NginxHTTPRequestFormValue, key: string,
        form: NginxHTTPRequestForm) => void, thisArg?: any): void;
    hasFiles(): boolean;
}

interface NginxHTTPRequest {
    /**
     * Request arguments object.
     *
     * Since 0.7.6, duplicate keys are returned as an array, keys are
     * case-sensitive, both keys and values are percent-decoded.
     * For example, the query string
     *
     * 'a=1&b=%32&A=3&b=4&B=two%20words'
     * is converted to r.args as:
     *
     *   {a: "1", b: ["2", "4"], A: "3", B: "two words"}
     */
    readonly args: NginxHTTPArgs;
    /**
     * After calling this function, next data chunks will be passed to
     * the client without calling js_body_filter.
     *
     * **Warning:**  May be called only from the js_body_filter function.
     *
     * @since 0.5.2
     */
    done(): void;
    /**
     * Writes a string to the error log on the error level of logging.
     * @param message Message to log.
     */
    error(message: NjsStringOrBuffer): void;
    /**
     * Finishes sending a response to the client.
     */
    finish(): void;
    /**
     * Incoming headers object.
     */
    readonly headersIn: NginxHeadersIn;
    /**
     * Outgoing headers object.
     */
    readonly headersOut: NginxHeadersOut;
    /**
     * HTTP protocol version.
     */
    readonly httpVersion: string;
    /**
     * Performs an internal redirect to the specified uri.
     * If the uri starts with the “@” prefix, it is considered a named location.
     * The actual redirect happens after the handler execution is completed.
     * Since 0.7.4, the method accepts escaped URIs.
     * @param uri Location to redirect to.
     */
    internalRedirect(uri: NjsStringOrBuffer): void;
    /**
     * Writes a string to the error log on the info level of logging.
     * @param message Message to log.
     */
    log(message: NjsStringOrBuffer): void;
    /**
     * HTTP method.
     */
    readonly method: string;
    /**
     * Parent for subrequest object.
     */
    readonly parent?: NginxHTTPRequest;
    /**
     * An array of key-value pairs exactly as they were received from the client.
     * @since 0.4.1
     */
    readonly rawHeadersIn: [NjsFixedSizeArray<2, string>];
    /**
     * An array of key-value pairs of response headers.
     * Header field names are not converted to lower case, duplicate field values are not merged.
     * @since 0.4.1
     */
    readonly rawHeadersOut: [NjsFixedSizeArray<2, string>];
    /**
     * Client address.
     */
    readonly remoteAddress: string;
    /**
     * Client request body if it has not been written to a temporary file.
     * To ensure that the client request body is in memory, its size should be
     * limited by client_max_body_size, and a sufficient buffer size should be set
     * using client_body_buffer_size. The property is available only in the js_content directive.
     *
     * @since 0.5.0
     */
    readonly requestBuffer?: Buffer;
    /**
     * The same as `requestBuffer`, but returns a string.
     *
     * **Warning:** It may convert bytes invalid in UTF-8 encoding into the replacement character.
     *
     * @see requestBuffer
     * @since 0.5.0
     */
    readonly requestText?: string;
    /**
     * The same as `requestBuffer`, but returns a string.
     *
     * **Warning:** It may convert bytes invalid in UTF-8 encoding into the replacement character.
     *
     * @see requestBuffer
     * @see requestText
     * @deprecated Use `requestText` or `requestBuffer` instead.
     */
    readonly requestBody?: string;
    /**
     * Reads the client request body and returns a Promise resolving
     * with the body as a string.
     *
     * Available in js_access and js_content directives.  The request body
     * size is limited by client_max_body_size.
     *
     * The body is read once and cached on the request: subsequent reads
     * across any combination of `readRequestText`, `readRequestArrayBuffer`,
     * `readRequestJSON`, and `readRequestForm` resolve synchronously from
     * the cache and do not re-read the wire.  This deliberately differs
     * from the WHATWG Fetch Body mixin (which makes the body unusable
     * after the first call) and matches the server-side caching pattern
     * used by Express, Flask, and similar frameworks.
     *
     * A second call issued while a previous `readRequest*` promise has
     * not yet resolved throws `"request body is already being read"`.
     *
     * @returns A Promise that resolves with the request body as a string.
     * @since 0.9.9
     */
    readRequestText(): Promise<string>;
    /**
     * Reads the client request body and returns a Promise resolving
     * with the body as an ArrayBuffer.  See {@link readRequestText} for
     * caching, concurrency, and availability semantics.
     *
     * @returns A Promise that resolves with the request body
     *   as an ArrayBuffer.
     * @since 0.9.9
     */
    readRequestArrayBuffer(): Promise<ArrayBuffer>;
    /**
     * Reads the client request body and returns a Promise resolving
     * with the body parsed as JSON.  See {@link readRequestText} for
     * caching, concurrency, and availability semantics.
     *
     * @returns A Promise that resolves with the parsed JSON value.
     * @since 0.9.9
     */
    readRequestJSON(): Promise<any>;
    /**
     * Reads the client request body and parses it as a supported HTML form.
     *
     * Supports `application/x-www-form-urlencoded` and
     * `multipart/form-data`.
     *
     * For text fields, the value is the decoded string.  For file parts,
     * the value is a File-like object exposing only the client-supplied
     * filename via `name`.  File contents are not exposed in this release.
     *
     * Filename is client-supplied and not sanitized - validate it before
     * using it for filesystem paths, log lines, or redirects.
     *
     * See {@link readRequestText} for body caching, concurrency, and
     * availability semantics.  In addition, the parsed form is itself
     * cached: a second call returns the same parsed result and ignores
     * any new options argument.
     *
     * @since 0.9.9
     */
    readRequestForm(options?: { maxKeys?: number }): Promise<NginxHTTPRequestForm>;
    /**
     * Subrequest response body. The size of response body is limited by
     * the subrequest_output_buffer_size directive.
     *
     * @since 0.5.0
     */
    readonly responseBuffer?: Buffer;
    /**
     * The same as `responseBuffer`, but returns a string.
     *
     * **Warning:** It may convert bytes invalid in UTF-8 encoding into the replacement character.
     *
     * @see responseBuffer
     */
    readonly responseText?: string;
    /**
     * The same as `responseBuffer`, but returns a string.
     *
     * **Warning:** It may convert bytes invalid in UTF-8 encoding into the replacement character.
     *
     * @see responseBuffer
     * @see responseText
     * @deprecated Use `responseText` or `responseBuffer` instead.
     */
    readonly responseBody?: string;
    /**
     * Sends the entire response with the specified status to the client.
     * It is possible to specify either a redirect URL (for codes 301, 302, 303, 307, and 308)
     * or the response body text (for other codes) as the second argument.
     * @param status Respose status code.
     * @param body Respose body.
     */
    return(status: number, body?: NjsStringOrBuffer): void;
    /**
     * Signals that the handler has no opinion about whether access
     * should be allowed or denied.  Useful with the ``satisfy any``
     * directive: without this call the handler implicitly allows
     * access (returns NGX_OK to the access phase checker).
     */
    decline(): void;
    /**
     * Sends a part of the response body to the client.
     */
    send(part: NjsStringOrBuffer): void;
    /**
     * Adds data to the chain of data chunks to be forwarded to the next body filter.
     * The actual forwarding happens later, when the all the data chunks of the current
     * chain are processed.
     *
     * **Warning:**  May be called only from the js_body_filter function.
     *
     * @since 0.5.2
     * @param data Data to send.
     * @param options Object used to override nginx buffer flags derived from
     * an incoming data chunk buffer.
     */
    sendBuffer(data: NjsStringOrBuffer, options?: NginxHTTPSendBufferOptions): void;
    /**
     * Sends the HTTP headers to the client.
     */
    sendHeader(): void;
    /**
     * Respose status code.
     */
    status: number;
    /**
     * Creates a subrequest with the given uri and options.
     * A subrequest shares its input headers with the client request.
     * To send headers different from original headers to a proxied server,
     * the proxy_set_header directive can be used. To send a completely new
     * set of headers to a proxied server, the proxy_pass_request_headers directive can be used.
     * @param uri Subrequest location.
     * @param options Subrequest options.
     * @param callback Completion callback.
     */
    subrequest(uri: NjsStringOrBuffer, options: NginxSubrequestOptions & { detached: true }): void;
    subrequest(uri: NjsStringOrBuffer, options?: NginxSubrequestOptions | string): Promise<NginxHTTPRequest>;
    subrequest(uri: NjsStringOrBuffer, options: NginxSubrequestOptions & { detached?: false } | string,
               callback:(reply:NginxHTTPRequest) => void): void;
    subrequest(uri: NjsStringOrBuffer, callback:(reply:NginxHTTPRequest) => void): void;
    /**
     * Current URI in request, normalized.
     */
    readonly uri: string;
    /**
     * nginx variables as Buffers.
     *
     * @since 0.5.0
     * @see variables
     */
    readonly rawVariables: NginxRawVariables;
    /**
     * nginx variables as strings.
     *
     * After 0.8.5 bytes invalid in UTF-8 encoding are converted into the replacement characters.
     *
     * @see rawVariables
     */
    readonly variables: NginxVariables;
    /**
     * Writes a string to the error log on the warn level of logging.
     * @param message Message to log.
     */
    warn(message: NjsStringOrBuffer): void;
}


/**
 * NginxPeriodicSession object is available as the first argument in the js_periodic handler.
 * @since 0.8.1
 */
interface NginxPeriodicSession {
    /**
     * nginx variables as Buffers.
     *
     * @see variables
     */
    readonly rawVariables: NginxRawVariables;
    /**
     * nginx variables as strings.
     *
     * **Warning:** Bytes invalid in UTF-8 encoding may be converted into the replacement character.
     *
     * @see rawVariables
     */
    readonly variables: NginxVariables;
}

interface NginxStreamVariables {
    readonly 'binary_remote_addr'?: string;
    readonly 'bytes_received'?: string;
    readonly 'bytes_sent'?: string;
    readonly 'connection'?: string;
    readonly 'geoip_area_code'?: string;
    readonly 'geoip_city'?: string;
    readonly 'geoip_city_continent_code'?: string;
    readonly 'geoip_city_country_code'?: string;
    readonly 'geoip_city_country_code3'?: string;
    readonly 'geoip_city_country_name'?: string;
    readonly 'geoip_country_code'?: string;
    readonly 'geoip_country_code3'?: string;
    readonly 'geoip_country_name'?: string;
    readonly 'geoip_dma_code'?: string;
    readonly 'geoip_latitude'?: string;
    readonly 'geoip_longitude'?: string;
    readonly 'geoip_org'?: string;
    readonly 'geoip_postal_code'?: string;
    readonly 'geoip_region'?: string;
    readonly 'geoip_region_name'?: string;
    readonly 'hostname'?: string;
    readonly 'limit_conn_status'?: string;
    readonly 'msec'?: string;
    readonly 'nginx_version'?: string;
    readonly 'pid'?: string;
    readonly 'proxy_add_x_forwarded_for'?: string;
    readonly 'proxy_host'?: string;
    readonly 'proxy_port'?: string;
    readonly 'proxy_protocol_addr'?: string;
    readonly 'proxy_protocol_port'?: string;
    readonly 'proxy_protocol_server_addr'?: string;
    readonly 'proxy_protocol_server_port'?: string;
    readonly 'realip_remote_addr'?: string;
    readonly 'realip_remote_port'?: string;
    readonly 'remote_addr'?: string;
    readonly 'remote_port'?: string;
    readonly 'server_addr'?: string;
    readonly 'server_port'?: string;
    readonly 'ssl_cipher'?: string;
    readonly 'ssl_ciphers'?: string;
    readonly 'ssl_client_cert'?: string;
    readonly 'ssl_client_escaped_cert'?: string;
    readonly 'ssl_client_fingerprint'?: string;
    readonly 'ssl_client_i_dn'?: string;
    readonly 'ssl_client_raw_cert'?: string;
    readonly 'ssl_client_s_dn'?: string;
    readonly 'ssl_client_s_dn_legacy'?: string;
    readonly 'ssl_client_serial'?: string;
    readonly 'ssl_client_v_end'?: string;
    readonly 'ssl_client_v_remain'?: string;
    readonly 'ssl_client_v_start'?: string;
    readonly 'ssl_client_verify'?: string;
    readonly 'ssl_curves'?: string;
    readonly 'ssl_early_data'?: string;
    readonly 'ssl_preread_alpn_protocols'?: string;
    readonly 'ssl_preread_protocol'?: string;
    readonly 'ssl_preread_server_name'?: string;
    readonly 'ssl_protocol'?: string;
    readonly 'ssl_server_name'?: string;
    readonly 'ssl_session_id'?: string;
    readonly 'ssl_session_reused'?: string;
    readonly 'status'?: string;
    readonly 'time_iso8601'?: string;
    readonly 'time_local'?: string;

    [prop: string]: string | undefined;
}

/**
 * @since 0.5.0
 */
type NginxStreamRawVariables = {
    [K in keyof NginxStreamVariables]: Buffer | undefined;
};

interface NginxStreamCallbackFlags {
    /**
     * True if data is a last buffer.
     */
    last: boolean
}

interface NginxStreamSendOptions {
    /**
     * True if data is a last buffer.
     */
    last?: boolean
    /**
     * True if the buffer should have the flush flag.
     */
    flush?: boolean
}

interface NginxStreamRequest {
    /**
     * Successfully finalizes the phase handler. An alias to s.done(0).
     *
     * @since 0.2.4
     * @see done()
     */
    allow(): void;
    /**
     * Passing control to the next handler of the current phase (if any).
     * An alias to s.done(-5).
     *
     * @since 0.2.4
     * @see done()
     */
    decline(): void;
    /**
     * Finalizes the phase handler with the access error code.
     * An alias to s.done(403).
     *
     * @since 0.2.4
     * @see done()
     */
    deny(): void;
    /**
     * Sets an exit code for the current phase handler to a code value.
     * The actual finalization happens when the js handler is completed and
     * all pending events, for example from ngx.fetch() or setTimeout(),
     * are processed.
     *
     * @param code Finalization code, by default is 0.
     * Possible code values:
     *   0 - successful finalization, passing control to the next phase
     *  -5 - undecided, passing control to the next handler of the current
     *  phase (if any)
     * 403 - access is forbidden
     * @since 0.2.4
     * @see allow()
     * @see decline()
     * @see deny()
     */
    done(code?: number): void;
    /**
     * Writes a string to the error log on the error level of logging.
     * @param message Message to log.
     */
    error(message: NjsStringOrBuffer): void;
    /**
     * Writes a string to the error log on the info level of logging.
     * @param message Message to log.
     */
    log(message: NjsStringOrBuffer): void;
    /**
     * Unregisters the callback set by on() method.
     * @param event Event type to unregister.
     * @see on()
     */
    off(event: "upload" | "download" | "upstream" | "downstream"): void;
    /**
     * Registers a callback for the specified event.
     * @param event Event type to register. The callback data value type
     * depends on the event type. For "upload" | "download" the data type is string.
     * For "upstream" | "downstream" the data type is Buffer.
     * String and buffer events cannot be mixed for a single session.
     *
     * **Warning:** For string data type bytes invalid in UTF-8 encoding may be
     * converted into the replacement character.
     * @see off()
     */
    on(event: "upload" | "download",
       callback: (data: string, flags: NginxStreamCallbackFlags) => void): void;
    on(event: "upstream" | "downstream",
       callback: (data: Buffer, flags: NginxStreamCallbackFlags) => void): void;
    /**
     * Client address.
     */
    readonly remoteAddress: string;
    /**
     * Adds data to the chain of data chunks that will be forwarded in
     * the forward direction: in download callback to a client; in upload
     * to an upstream server. The actual forwarding happens later, when the all
     * the data chunks of the current chain are processed.
     *
     * @since 0.2.4
     * @param data Data to send.
     * @param options Object used to override nginx buffer flags derived from
     * an incoming data chunk buffer.
     * @see on()
     */
    send(data: NjsStringOrBuffer, options?: NginxStreamSendOptions): void;
    /**
     * The stream session exit status. It is an alias to the $status variable.
     * @since 0.5.2
     */
    readonly status: number;
    /**
     * nginx variables as Buffers.
     *
     * @since 0.5.0
     * @see variables
     */
    readonly rawVariables: NginxStreamRawVariables;
    /**
     * nginx variables as strings.
     *
     * After 0.8.5 bytes invalid in UTF-8 encoding are converted into the replacement characters.
     *
     * @see rawVariables
     */
    readonly variables: NginxStreamVariables;
    /**
     * Writes a string to the error log on the warn level of logging.
     * @param message Message to log.
     */
    warn(message: NjsStringOrBuffer): void;
}


/**
 * NginxPeriodicSession object is available as the first argument in the js_periodic handler.
 * @since 0.8.1
 */
interface NginxPeriodicSession {
    /**
     * nginx variables as Buffers.
     *
     * @see variables
     */
    readonly rawVariables: NginxRawVariables;
    /**
     * nginx variables as strings.
     *
     * **Warning:** Bytes invalid in UTF-8 encoding may be converted into the replacement character.
     *
     * @see rawVariables
     */
    readonly variables: NginxVariables;
}
type BufferEncoding = "utf8" | "hex" | "base64" | "base64url";

type NjsFixedSizeArray<N extends number, T> = N extends 0 ? never[] : {
    0: T;
    length: N;
} & ReadonlyArray<T>;

type TypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    | Float64Array;

/**
 * Raw data is stored in instances of the `Buffer` class.
 */
declare class Buffer extends Uint8Array {
    /**
     * Allocates a new `Buffer` of a specified `size`.
     *
     * @param size The count of octets to allocate.
     * @param fill If specified, the allocated `Buffer` will be initialized by calling `buf.fill(fill)`.
     *   Otherwise, the `Buffer` will be zero-filled.
     * @param encoding The character encoding used for call to `buf.fill(fill, encoding)` while
     *   initalizing. Defaults to`'utf8'`.
     */
    static alloc(size: number, fill?: string | Uint8Array | number, encoding?: BufferEncoding): Buffer;
    /**
     * The same as `Buffer.alloc()`, with the difference that the memory allocated for the buffer
     * is not initialized, the contents of the new buffer is unknown and may contain sensitive data.
     *
     * @param size The count of octets to allocate.
     */
    static allocUnsafe(size: number): Buffer;

    /**
     * Returns the byte length of the specified `value`, when encoded using `encoding`.
     *
     * @param value The value to test.
     * @param encoding The character encoding used to evaluate `value` if `value` is a `string`.
     *   Defaults to `'utf8'`.
     */
    static byteLength(value: string | Buffer | TypedArray | DataView | ArrayBuffer, encoding?: BufferEncoding): number;

    /**
     * Compares `buffer1` with `buffer2` when sorting arrays of buffer instances.
     *
     * @return
     * - `0` if `buffer2` is the same as `buffer1`,
     * - `1` if `buffer2` should come _before_ `buffer1` when sorted,
     * - `-1` if `buffer2` should come _after_ `buffer1` when sorted.
     */
    static compare(buf1: Uint8Array, buf2: Uint8Array): -1 | 0 | 1;

    /**
     * Returns a new `Buffer` which is the result of concatenating all the `Buffer` instances in
     * the `list`. If there are no items in the `list` or the total length is 0, a new zero-length
     * `Buffer` is returned.
     *
     * @param list An array of `Buffer` or `Uint8Array` objects to concatenate.
     * @param totalLength Total length of the buffers when concatenated, coerced to an unsigned
     *   integer. If not specified, it is calculated from the `Buffer` instances in `list` by adding
     *   their lengths. If the combined length of the Buffers in list exceeds `totalLength`, the
     *   result is truncated to `totalLength`.
     */
    static concat(list: Uint8Array[], totalLength?: number): Buffer;

    /**
     * @param arrayBuffer The `.buffer` property of any `TypedArray` or a `new ArrayBuffer()`.
     * @param byteOffset An integer specifying the index of the first byte to expose. Defaults to `0`.
     * @param length An integer specifying number of bytes to expose.
     *   Defaults to `arrayBuffer.byteLength - byteOffset`.
     */
    static from(arrayBuffer: ArrayBuffer, byteOffset?: number, length?: number): Buffer;
    /**
     * Allocates a new `Buffer` using an array of bytes in the range `0 – 255`. Array entries
     * outside that range will be truncated.
     *
     * @param data The data to create a new `Buffer`.
     */
    static from(data: number[]): Buffer;
    /**
     * Copies the passed buffer `data` onto a new `Buffer` instance.
     *
     * @param data The buffer to copy.
     */
    static from(data: Uint8Array): Buffer;
    /**
     * For objects whose `valueOf()` function returns a value not strictly equal to object, returns
     * `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.
     *
     * @param obj An object supporting `valueOf()`.
     */
    static from(obj: { valueOf(): string | object }, byteOffset?: number, length?: number): Buffer;
    /**
     * Creates a new `Buffer` with a string `str`.
     *
     * @param str The string to create a new `Buffer`.
     * @param encoding The character encoding to be used when converting a string into bytes.
     *   Defaults to `'utf8'`.
     */
    static from(str: string, encoding?: BufferEncoding): Buffer;

    /**
     * Returns true if the `obj` is a `Buffer`.
     *
     * @param obj The object to test.
     */
    static isBuffer(obj: any): obj is Buffer;

    /**
     * Returns `true` if `encoding` is the name of a supported character encoding.
     *
     * @param encoding The string to test.
     */
    static isEncoding(encoding: string): encoding is BufferEncoding;

    /**
     * The underlying `ArrayBuffer` object based on which this `Buffer` object is created.
     */
    readonly buffer: ArrayBuffer;
    /**
     * Specifies the `byteOffset` of the Buffer's underlying `ArrayBuffer` object.
     */
    readonly byteOffset: number;
    /**
     * The number of bytes in this buffer.
     */
    readonly length: number;

    /**
     * Constructor cannot be called.
     */
    private constructor();

    /**
     * The index operator can be used to get and set the octet at position index in buffer.
     * The values refer to individual bytes, so the legal value range is between 0 and 255 (decimal).
     */
    [index: number]: number;

    /**
     * Compares this buffer (source) with the `target` and returns a number indicating whether this
     * buffer comes before, after, or is the same as the `target` in sort order. Comparison is based
     * on the actual sequence of bytes in each `Buffer`.
     *
     * @param target The target buffer for comparison.
     * @param targetStart An integer specifying the offset within `target` at which to begin
     *   comparison. Defaults to `0`.
     * @param targetEnd An integer specifying the offset within `target` at which to end comparison.
     *   Defaults to `target.length`.
     * @param sourceStart An integer specifying the offset within this buffer at which to begin
     *   comparison. Defaults to `0`.
     * @param sourceEnd An integer specifying the offset within this buffer at which to end comparison
     *   (not inclusive). Defaults to `buf.length`.
     * @return
     * - `0` if `target` is the same as this buffer,
     * - `1` if `target` should come _before_ this buffer when sorted,
     * - `-1` if `target` should come _after_ this buffer when sorted.
     */
    compare(target: Uint8Array, targetStart?: number, targetEnd?: number, sourceStart?: number, sourceEnd?: number): -1 | 0 | 1;

    /**
     * Copies data from a region of this buffer to a region in `target`, even if the `target`
     * memory region overlaps with this buffer.
     *
     * @param target The target buffer.
     * @param targetStart An integer specifying the offset within `target` at which to begin writing.
     *   Defaults to `0`.
     * @param sourceStart An integer specifying the offset within this buffer from which to begin
     *   copying. Defaults to `0`.
     * @param sourceEnd An integer specifying the offset within this buffer at which to stop copying
     *   (not inclusive). Defaults to `buf.length`.
     * @return The number of bytes copied.
     */
    copy(target: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;

    /**
     * Returns `true` if both this buffer and `other` buffer have exactly the same bytes.
     *
     * @param other The other buffer to compare with.
     */
    equals(other: Uint8Array): boolean;

    /**
     * Fills this buffer with the specified `value`. If the `offset` and `end` are not specified,
     * the entire buffer will be filled. The `value` is coerced to `uint32` if it is not a `string`,
     * `Buffer`, or `integer`. If the resulting integer is greater than `255`, the buffer will be
     * filled with `value` and `255`.
     *
     * @param value The value with which to fill this buffer.
     * @param offset Number of bytes to skip before starting to fill this buffer. Defaults to `0`.
     * @param end Where to stop filling this buffer (not inclusive). Defaults to `buf.length`.
     * @param encoding The encoding for `value` if `value` is a `string`. Defaults to `'utf8'`.
     */
    fill(value: string | Uint8Array | number, offset?: number, end?: number, encoding?: BufferEncoding): this;

    /**
     * Equivalent to `buf.indexOf() !== -1`, returns `true` if the `value` was found in this buffer.
     *
     * @param value What to search for. If a `number`, it must be between `0` and `255`.
     * @param byteOffset Where to begin search in this buffer. Defaults to `0`.
     * @param encoding The encoding for `value` if `value` is a `string`. Defaults to `'utf8'`.
     */
    includes(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): boolean;

    /**
     * Returns an integer which is the index of the first occurrence of `value` in this buffer,
     * or `-1` if this buffer does not contain `value`.
     *
     * @param value What to search for. If a `number`, it must be between `0` and `255`.
     * @param byteOffset Where to begin search in this buffer. Defaults to `0`.
     * @param encoding The encoding for `value` if `value` is a `string`. Defaults to `'utf8'`.
     */
    indexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number;
    /**
     * The same as `buf.indexOf()`, except the last occurrence of the `value` is found instead of
     * the first occurrence. If the `value` is an empty `string` or empty `Buffer`, `byteOffset`
     * will be returned.
     *
     * @param value What to search for. If a `number`, it must be between `0` and `255`.
     * @param byteOffset Where to begin search in this buffer. Defaults to `0`.
     * @param encoding The encoding for `value` if `value` is a `string`. Defaults to `'utf8'`.
     */
    lastIndexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number;

    /**
     * Reads the `byteLength` from this buffer at the specified `offset` and interprets the result
     * as a big-endian, two's complement signed value supporting up to 48 bits of accuracy.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     */
    readIntBE(offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.readIntBE}.
     */
    readInt8(offset?: number): number;
    /**
     * @see {Buffer.prototype.readIntBE}.
     */
    readInt16BE(offset?: number): number;
    /**
     * @see {Buffer.prototype.readIntBE}.
     */
    readInt32BE(offset?: number): number;
    /**
     * Reads the `byteLength` from this buffer at the specified `offset` and interprets the result
     * as a little-endian, two's complement signed value supporting up to 48 bits of accuracy.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     */
    readIntLE(offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.readIntLE}.
     */
    readInt16LE(offset?: number): number;
    /**
     * @see {Buffer.prototype.readIntLE}.
     */
    readInt32LE(offset?: number): number;

    /**
     * Reads the `byteLength` from this buffer at the specified `offset` and interprets the result
     * as a big-endian integer supporting up to 48 bits of accuracy.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     */
    readUIntBE(offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.readUIntBE}.
     */
    readUInt8(offset?: number): number;
    /**
     * @see {Buffer.prototype.readUIntBE}.
     */
    readUInt16BE(offset?: number): number;
    /**
     * @see {Buffer.prototype.readUIntBE}.
     */
    readUInt32BE(offset?: number): number;
    /**
     * Reads the `byteLength` from this buffer at the specified `offset` and interprets the result
     * as a little-endian integer supporting up to 48 bits of accuracy.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     */
    readUIntLE(offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.readUIntLE}.
     */
    readUInt16LE(offset?: number): number;
    /**
     * @see {Buffer.prototype.readUIntLE}.
     */
    readUInt32LE(offset?: number): number;

    /**
     * Reads a 64-bit, big-endian double from this buffer at the specified `offset`.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - 8`. Defaults to `0`.
     */
    readDoubleBE(offset?: number): number;
    /**
     * Reads a 64-bit, little-endian double from this buffer at the specified `offset`.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - 8`. Defaults to `0`.
     */
    readDoubleLE(offset?: number): number;

    /**
     * Reads a 32-bit, big-endian float from this buffer at the specified `offset`.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - 4`. Defaults to `0`.
     */
    readFloatBE(offset?: number): number;
    /**
     * Reads a 32-bit, little-endian float from this buffer at the specified `offset`.
     *
     * @param offset An integer specifying the number of bytes to skip before starting to read.
     *   Must satisfy `0 <= offset <= buf.length - 4`. Defaults to `0`.
     */
    readFloatLE(offset?: number): number;

    /**
     * Returns a new `Buffer` that references **the same memory as the original**, but offset and
     * cropped by `start` and `end`.
     *
     * @param start Where the new `Buffer` will start. Defaults to `0`.
     * @param end Where the new `Buffer` will end (not inclusive). If `end` is greater than
     *   `buf.length`, the same result as that of end equal to `buf.length` is returned.
     *   Defaults to `buf.length`.
     */
    subarray(start?: number, end?: number): Buffer;

    /**
     * Returns a new `Buffer` that references **the same memory as the original**, but offset and
     * cropped by the `start` and end `values`.
     *
     * @param start Where the new `Buffer` will start. Defaults to `0`.
     * @param end Where the new `Buffer` will end (not inclusive). Defaults to `buf.length`.
     */
    slice(begin?: number, end?: number): Buffer;

    /**
     * Interprets this buffer as an array of unsigned 16-bit numbers and swaps the byte order
     * in-place.
     *
     * @throws {RangeError} if `buf.length` is not a multiple of 2.
     */
    swap16(): Buffer;
    /**
     * Interprets this buffer as an array of unsigned 32-bit numbers and swaps the byte order
     * in-place.
     *
     * @throws {RangeError} if `buf.length` is not a multiple of 4.
     */
    swap32(): Buffer;
    /**
     * Interprets this buffer as an array of 64-bit numbers and swaps byte order in-place.
     *
     * @throws {RangeError} if `buf.length` is not a multiple of 8.
     */
    swap32(): Buffer;

    /**
     * Returns a JSON representation of this buffer. `JSON.stringify()` implicitly calls this
     * function when stringifying a `Buffer` instance.
     */
    toJSON(): { type: "Buffer"; data: number[] };

    /**
     * Decodes this buffer to a string according to the specified character `encoding`.
     *
     * @param encoding The character encoding. Defaults to `'utf8'`.
     * @param start The byte offset to start decoding at. Defaults to `0`.
     * @param end The byte offset to stop decoding at (not inclusive). Defaults to `buf.length`.
     */
    toString(encoding?: BufferEncoding, start?: number, end?: number): string;

    /**
     * Writes a string `str` to this buffer at the `offset` according to the character `encoding`.
     * If this buffer did not contain enough space to fit the entire string, only part of the
     * string will be written, however, partially encoded characters will not be written.
     *
     * @param str The string to write into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write `str`.
     *   Defaults to `0`.
     * @param length An integer specifying the number of bytes to write.
     *   Defaults to `buf.length - offset`.
     * @param encoding The character encoding of `str`. Defaults to `'utf8'`.
     * @return Offset plus the number of bytes written.
     */
    write(str: string, encoding?: BufferEncoding): number;
    write(str: string, offset: number, encoding?: BufferEncoding): number;
    write(str: string, offset: number, length: number, encoding?: BufferEncoding): number;

    /**
     * Writes `byteLength` bytes of `value` to this buffer at the specified `offset` as big-endian.
     * Supports up to 48 bits of accuracy.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     * @return Offset plus the number of bytes written.
     */
    writeIntBE(value: number, offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.writeIntBE}.
     */
    writeInt8(value: number, offset?: number): number;
    /**
     * @see {Buffer.prototype.writeIntBE}.
     */
    writeInt16BE(value: number, offset?: number): number;
    /**
     * @see {Buffer.prototype.writeIntBE}.
     */
    writeInt32BE(value: number, offset?: number): number;
    /**
     * Writes `byteLength` bytes of `value` to this buffer at the specified `offset` as
     * little-endian. Supports up to 48 bits of accuracy.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     * @return Offset plus the number of bytes written.
     */
    writeIntLE(value: number, offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.writeIntLE}.
     */
    writeInt16LE(value: number, offset?: number): number;
    /**
     * @see {Buffer.prototype.writeIntLE}.
     */
    writeInt32LE(value: number, offset?: number): number;

    /**
     * Writes `byteLength` bytes of `value` to this buffer at the specified `offset` as big-endian.
     * Supports up to 48 bits of accuracy.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     * @return Offset plus the number of bytes written.
     */
    writeUIntBE(value: number, offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.writeUIntBE}.
     */
    writeUInt8(value: number, offset?: number): number;
    /**
     * @see {Buffer.prototype.writeUIntBE}.
     */
    writeUInt16BE(value: number, offset?: number): number;
    /**
     * @see {Buffer.prototype.writeUIntBE}.
     */
    writeUInt32BE(value: number, offset?: number): number;
    /**
     * Writes `byteLength` bytes of `value` to this buffer at the specified `offset` as
     * little-endian. Supports up to 48 bits of accuracy.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - byteLength`.
     * @param byteLength An integer between `1` and `6` specifying the number of bytes to read.
     *   Must satisfy `0 < byteLength <= 6`.
     * @return Offset plus the number of bytes written.
     */
    writeUIntLE(value: number, offset: number, byteLength: number): number;
    /**
     * @see {Buffer.prototype.writeUIntLE}.
     */
    writeUInt16LE(value: number, offset?: number): number;
    /**
     * @see {Buffer.prototype.writeUIntLE}.
     */
    writeUInt32LE(value: number, offset?: number): number;

    /**
     * Writes the `value` to this buffer at the specified `offset` as big-endian.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - 8`. Defaults to `0`.
     * @return Offset plus the number of bytes written.
     */
    writeDoubleBE(value: number, offset?: number): number;
    /**
     * Writes the `value` to this buffer at the specified `offset` as little-endian.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - 8`. Defaults to `0`.
     * @return Offset plus the number of bytes written.
     */
    writeDoubleLE(value: number, offset?: number): number;

    /**
     * Writes the `value` to this buffer at the specified `offset` as big-endian.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - 4`. Defaults to `0`.
     * @return Offset plus the number of bytes written.
     */
    writeFloatBE(value: number, offset?: number): number;
    /**
     * Writes the `value` to this buffer at the specified `offset` as little-endian.
     *
     * @param value The number to be written into this buffer.
     * @param offset An integer specifying the number of bytes to skip before starting to write.
     *   Must satisfy `0 <= offset <= buf.length - 4`. Defaults to `0`.
     * @return Offset plus the number of bytes written.
     */
    writeFloatLE(value: number, offset?: number): number;
}

type NjsStringOrBuffer = string | Buffer | DataView | TypedArray | ArrayBuffer;
type NjsBuffer = Buffer | DataView | TypedArray;

// Global objects

interface NjsGlobal {
    /**
     * Returns current njs version as a string.
     * For example, '0.7.4'.
     */
    readonly version: string;
    /**
     * Returns a number with the current version of njs.
     * For example, “0.7.4” is returned as 0x000704.
     * @since 0.7.4
     */
    readonly version_number: number;
    dump(value: any, indent?: number): string;
    /**
     * Registers a callback for the "exit" event. The callback is called before
     * the VM is destroyed.
     */
    on(event: "exit", callback: () => void): void;
}

declare const njs: NjsGlobal;

interface NjsEnv {
    readonly [prop: string]: string;
}

interface NjsProcess {
    readonly pid: number;
    readonly ppid: number;
    readonly argv: string[];
    readonly env: NjsEnv;

    /**
     * Send signal to a process by its PID.
     * @since 0.8.8
     */
    kill(pid: number, signal?: string | number): true;
}

declare const process: NjsProcess;

/**
 * A value returned by `setTimeout()` and `setImmediate()` functions. It's an positive integer now,
 * but this may be changed in future, so it should be treated as an opaque value.
 */
type TimerHandle = number & { readonly '': unique symbol };

/**
 * Schedules the "immediate" execution of the given function after I/O events' callbacks.
 *
 * @param callback The function to call.
 * @param args Optional arguments to pass to the `callback` function.
 * @returns A value which identifies the timer created by the call.
 *
 * @throws {TypeError} if `callback` is not a function.
 * @throws {InternalError} if timers are not supported by host environment.
 */
declare function setImmediate<TArgs extends any[]>(callback: (...args: TArgs) => void, ...args: TArgs): TimerHandle;

/**
 * Schedules a timer which executes the given function after the specified delay.
 *
 * @param callback The function to call when the timer elapses.
 * @param delay The number of milliseconds to wait before calling the `callback`. Defaults to `0`,
 *   meaning execute "immediately", or more accurately, the next event cycle.
 * @param args Optional arguments to pass to the `callback` function.
 * @returns A value which identifies the timer created by the call; it can be passed to
 *   `clearTimeout()` to cancel the timeout.
 *
 * @throws {TypeError} if `callback` is not a function.
 * @throws {InternalError} if timers are not supported by host environment.
 */
declare function setTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, delay?: number, ...args: TArgs): TimerHandle;

/**
 * Cancels a timer previously established by calling `setTimeout()`.
 *
 * Note: Passing an invalid handle silently does nothing; no exception is thrown.
 *
 * @param handle A value returned by `setTimeout()`.
 */
declare function clearTimeout(handle?: TimerHandle): void;

/**
 * Decodes a string of data which has been encoded using Base64 encoding.
 *
 * @param encodedData is a binary string that contains Base64-encoded data.
 * @returns A string that contains decoded data from encodedData.
 */
declare function atob(encodedData: string): string;

/**
 * Creates a Base64-encoded ASCII string from a binary string.
 *
 * @param stringToEncode is a binary string to encode.
 * @returns A string containing the Base64 representation of stringToEncode.
 */
declare function btoa(stringToEncode: string): string;
/**
 * This class represents a decoder for a specific text encoding. Currently,
 * only `utf-8` is supported. A decoder takes a stream of bytes as input and
 * emits a stream of code points.
 *
 * @since 0.4.3
 */
declare class TextDecoder {
    /**
     * The name of the encoding used by this `TextDecoder`.
     */
    readonly encoding: "utf-8";
    /**
     * Whether the error mode is "fatal".
     */
    readonly fatal: boolean;
    /**
     * Whether the byte order marker is ignored.
     */
    readonly ignoreBOM: boolean;

    /**
     * Creates a new `TextDecoder` object for the specified encoding. Currently,
     * only `utf-8` is supported.
     */
    constructor(encoding?: "utf-8" | "utf8", options?: TextDecoderOptions);

    /**
     * Returns a string containing the text decoded with the method of the
     * specific `TextDecoder` object.
     *
     * The method can be invoked zero or more times with `options`'s `stream` set
     * to `true`, and then once without `options`'s stream (or set to `false`), to
     * process a fragmented input.
     *
     * If the error mode is `fatal` and `encoding`'s decoder returns an error, it
     * throws a `TypeError`.
     *
     * @example
     * ```
     * new TextDecoder().decode(new Uint8Array([206,177,206,178])) //=> αβ
     * ```
     *
     * @example
     * ```
     * const decoder = new TextDecoder("utf-8");
     * let buffer: ArrayBuffer;
     * let str = "";
     *
     * while (buffer = nextChunk()) {
     *     str += decoder.decode(buffer, { stream: true });
     * }
     * str += decoder.decode(); // end-of-queue
     * ```
     */
    decode(buffer?: ArrayBuffer, options?: TextDecodeOptions): string;
}

interface TextDecoderOptions {
    /**
     * The flag indicating if `TextDecoder.decode()` must throw the `TypeError`
     * exception when a coding error is found, by default is `false`.
     */
    fatal?: boolean;
}

interface TextDecodeOptions {
    /**
     * The flag indicating if additional data will follow in subsequent calls to
     * `decode()`: `true` if processing the data in chunks, and `false` for the
     * final chunk or if the data is not chunked. By default is `false`.
     */
    stream?: boolean;
}

/**
 * The `TextEncoder` object takes a stream of code points as input and emits a
 * stream of UTF-8 bytes.
 *
 * @since 0.4.3
 */
declare class TextEncoder {
    /**
     * Always returns `utf-8`.
     */
    readonly encoding: "utf-8";

    /**
     * Returns a newly constructed `TextEncoder` that will generate a byte stream
     * with UTF-8 encoding.
     */
    constructor();

    /**
     * Encodes given `input` string into a `Uint8Array` with UTF-8 encoded text.
     */
    encode(input?: string): Uint8Array;
    /**
     * Encodes given `source` string to UTF-8, puts the result into `destination`
     * `Uint8Array`, and returns an object indicating the progress of the
     * encoding.
     */
    encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult;
}

interface TextEncoderEncodeIntoResult {
    /**
     * The number of UTF-16 units of code from the source string converted to
     * UTF-8.
     */
    read: number;
    /**
     * The number of bytes modified in the destination `Uint8Array`.
     */
    written: number;
}
interface  RsaOaepParams {
    name: "RSA-OAEP";
}

interface  AesCtrParams {
    name: "AES-CTR";
    counter: NjsStringOrBuffer;
    length: number;
}

interface  AesCbcParams {
    name: "AES-CBC";
    iv: NjsStringOrBuffer;
}

interface  AesGcmParams {
    name: "AES-GCM";
    iv: NjsStringOrBuffer;
    additionalData?: NjsStringOrBuffer;
    tagLength?: number;
}

type CipherAlgorithm =
    | RsaOaepParams
    | AesCtrParams
    | AesCbcParams
    | AesGcmParams;

type HashVariants = "SHA-256" | "SHA-384" | "SHA-512" | "SHA-1";

interface  RsaHashedImportParams {
    name: "RSASSA-PKCS1-v1_5" | "RSA-PSS" | "RSA-OAEP";
    hash: HashVariants;
}

interface  RsaHashedKeyGenParams {
    name: "RSASSA-PKCS1-v1_5" | "RSA-PSS" | "RSA-OAEP";
    hash: HashVariants;
    modulusLength: number;
    publicExponent: Uint8Array;
}

interface  EcKeyImportParams {
    name: "ECDSA" | "ECDH";
    namedCurve: "P-256" | "P-384" | "P-521";
}

interface EcKeyGenParams {
    name: "ECDSA" | "ECDH";
    namedCurve: "P-256" | "P-384" | "P-521";
}

interface  HmacImportParams {
    name: "HMAC";
    hash: HashVariants;
}

type AesVariants = "AES-CTR" | "AES-CBC" | "AES-GCM" | "AES-KW";

interface  AesImportParams {
    name: AesVariants;
}

type ImportAlgorithm =
    | RsaHashedImportParams
    | EcKeyImportParams
    | HmacImportParams
    | AesImportParams
    | AesVariants
    | "PBKDF2"
    | "HKDF"
    | "ECDH"
    | "Ed25519"
    | "X25519";

type GenerateAlgorithm =
    | RsaHashedKeyGenParams
    | EcKeyGenParams
    | HmacKeyGenParams
    | AesKeyGenParams;

type JWK =
    | { kty: "RSA"; }
    | { kty: "EC"; }
    | { kty: "oct"; }
    | { kty: "OKP"; };

type KeyData =
    | NjsStringOrBuffer
    | JWK;

interface   HkdfParams {
    name: "HKDF";
    hash: HashVariants;
    salt: NjsStringOrBuffer;
    info: NjsStringOrBuffer;
}

interface   Pbkdf2Params {
    name: "PBKDF2";
    hash: HashVariants;
    salt: NjsStringOrBuffer;
    iterations: number;
}

interface   EcdhParams {
    name: "ECDH";
    public: CryptoKey;
}

interface   X25519Params {
    name: "X25519";
    public: CryptoKey;
}

type DeriveAlgorithm =
    | HkdfParams
    | Pbkdf2Params
    | EcdhParams
    | X25519Params;

interface   HmacKeyGenParams {
    name: "HMAC";
    hash: HashVariants;
}

interface   AesKeyGenParams {
    name: AesVariants;
    length: number;
}

type DeriveKeyAlgorithm =
    | HmacKeyGenParams
    | AesKeyGenParams;

interface   RsaPssParams {
    name: "RSA-PSS";
    saltLength: number;
}

interface   EcdsaParams {
    name: "ECDSA";
    hash: HashVariants;
}

type SignOrVerifyAlgorithm =
    | RsaPssParams
    | EcdsaParams
    | { name: "HMAC"; }
    | { name: "RSASSA-PKCS1-v1_5"; }
    | "HMAC"
    | "RSASSA-PKCS1-v1_5"
    | "Ed25519";

interface CryptoKey {
    /*
     * An object describing the algorithm for which this key can be used
     * and any associated extra parameters.
     * @since 0.8.0
     */
    readonly algorithm: GenerateAlgorithm;
    /*
     * A boolean value that is true if the key can be exported and false if not.
     * @since 0.8.0
     */
    readonly extractable: boolean;
    /*
     * A string value indicates which kind of key is represented by the object.
     *
     * It can have the following values:
     *  "secret": This key is a secret key for use with a symmetric algorithm.
     *  "private": This key is the private half of an asymmetric algorithm's CryptoKeyPair.
     *  "public": This key is the public half of an asymmetric algorithm's CryptoKeyPair.
     * @since 0.8.0
     */
    readonly type: string;

    /*
     * An array of strings indicating what this key can be used for.
     * Possible array values: "encrypt", "decrypt", "sign", "verify",
     *  "deriveKey", "deriveBits", "wrapKey", "unwrapKey".
     * @since 0.8.0
     */
    readonly usages: Array<string>;
}

type CryptoKeyPair = { privateKey: CryptoKey, publicKey: CryptoKey };

interface SubtleCrypto {
    /**
     * Decrypts encrypted data.
     *
     * @param algorithm Object specifying the algorithm to be used,
     *  and any extra parameters as required.
     * @param key CryptoKey containing the key to be used for decryption.
     * @param data Data to be decrypted.
     */
    decrypt(algorithm: CipherAlgorithm,
            key: CryptoKey,
            data: NjsStringOrBuffer): Promise<ArrayBuffer>;

    /**
     * Derives an array of bits from a base key.
     *
     * @param algorithm Object defining the derivation algorithm to use.
     * @param baseKey CryptoKey representing the input to the derivation algorithm.
     * @param length Number representing the number of bits to derive.
     */
    deriveBits(algorithm: DeriveAlgorithm,
               baseKey: CryptoKey,
               length: number): Promise<ArrayBuffer>;

    /**
     * Derives a secret key from a master key.
     *
     * @param algorithm Object defining the derivation algorithm to use.
     * @param baseKey CryptoKey representing the input to the derivation algorithm.
     * @param derivedKeyAlgorithm Object defining the algorithm the
     *  derived key will be used for.
     * @param extractable Unsupported.
     * @param usage Array indicating what can be done with the key.
     *  Possible array values: "encrypt", "decrypt", "sign", "verify",
     *  "deriveKey", "deriveBits", "wrapKey", "unwrapKey".
     */
    deriveKey(algorithm: DeriveAlgorithm,
              baseKey: CryptoKey,
              derivedKeyAlgorithm: DeriveKeyAlgorithm,
              extractable: boolean,
              usage: Array<string>): Promise<CryptoKey>;

    /**
     * Generates a digest of the given data.
     *
     * @param algorithm String defining the hash function to use.
     */
    digest(algorithm: HashVariants,
           data: NjsStringOrBuffer): Promise<ArrayBuffer>;

    /**
     * Encrypts data.
     *
     * @param algorithm Object specifying the algorithm to be used,
     *  and any extra parameters as required.
     * @param key CryptoKey containing the key to be used for encryption.
     * @param data Data to be encrypted.
     */
    encrypt(algorithm: CipherAlgorithm,
            key: CryptoKey,
            data: NjsStringOrBuffer): Promise<ArrayBuffer>;

    /**
     * Imports a key.
     *
     * @param format String describing the data format of the key to import.
     * Possible values: "raw", "pkcs8", "spki", "jwk" (since 0.7.10).
     * @param keyData Object containing the key in the given format.
     * @param algorithm Dictionary object defining the type of key to import
     *  and providing extra algorithm-specific parameters.
     * @param extractable Boolean indicating whether a key can be exported.
     * @param usage Array indicating what can be done with the key.
     *  Possible array values: "encrypt", "decrypt", "sign", "verify",
     *  "deriveKey", "deriveBits", "wrapKey", "unwrapKey".
     */
    importKey(format: "raw" | "pkcs8" | "spki" | "jwk",
              keyData: KeyData,
              algorithm: ImportAlgorithm,
              extractable: boolean,
              usage: Array<string>): Promise<CryptoKey>;

    /**
     * Exports a key.
     *
     * @since 0.7.10
     * @param format String describing the data format of the key to export.
     * Possible values: "raw", "pkcs8", "spki", "jwk".
     * @param key CryptoKey containing the key to be exported.
     */
    exportKey(format: "raw" | "pkcs8" | "spki" | "jwk",
              key: CryptoKey): Promise<ArrayBuffer|Object>;

    /**
     * Generates a key for symmetric algorithms.
     *
     * @since 0.7.10
     * @param algorithm Dictionary object defining the type of key to generate
     *  and providing extra algorithm-specific parameters.
     * @param extractable Boolean indicating whether a key can be exported.
     * @param usage Array indicating what can be done with the key.
     *  Possible array values: "encrypt", "decrypt", "sign", "verify",
     *  "deriveKey", "deriveBits", "wrapKey", "unwrapKey".
     */
    generateKey(algorithm: HmacKeyGenParams | AesKeyGenParams,
                extractable: boolean,
                usage: Array<string>): Promise<CryptoKey>;

    /**
     * Generates a key for asymmetric algorithms.
     *
     * @since 0.7.10
     * @param algorithm Dictionary object defining the type of key to generate
     *  and providing extra algorithm-specific parameters.
     * @param extractable Boolean indicating whether a key can be exported.
     * @param usage Array indicating what can be done with the key.
     *  Possible array values: "encrypt", "decrypt", "sign", "verify",
     *  "deriveKey", "deriveBits", "wrapKey", "unwrapKey".
     */
    generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams
                         | "Ed25519" | "X25519",
                extractable: boolean,
                usage: Array<string>): Promise<CryptoKeyPair>;

    /**
     * Generates a digital signature.
     *
     * @param algorithm String or object that specifies the signature
     *  algorithm to use and its parameters.
     * @param key CryptoKey containing the key to be used for signing.
     * @param data Data to be signed.
     */
    sign(algorithm: SignOrVerifyAlgorithm,
         key: CryptoKey,
         data: NjsStringOrBuffer): Promise<ArrayBuffer>;

    /**
     * Verifies a digital signature.
     *
     * @param algorithm String or object that specifies the signature
     *  algorithm to use and its parameters.
     * @param key CryptoKey containing the key to be used for verifying.
     * @param signature Signature to verify.
     * @param data Data to be verified.
     */
    verify(algorithm: SignOrVerifyAlgorithm,
           key: CryptoKey,
           signature: NjsStringOrBuffer,
           data: NjsStringOrBuffer): Promise<boolean>;

    wrapKey(format: "raw" | "pkcs8" | "spki" | "jwk",
            key: CryptoKey,
            wrappingKey: CryptoKey,
            wrapAlgorithm: CipherAlgorithm | "AES-KW"): Promise<ArrayBuffer>;

    unwrapKey(format: "raw" | "pkcs8" | "spki" | "jwk",
              wrappedKey: NjsStringOrBuffer,
              unwrappingKey: CryptoKey,
              unwrapAlgorithm: CipherAlgorithm | "AES-KW",
              unwrappedKeyAlgorithm: ImportAlgorithm,
              extractable: boolean,
              keyUsages: Array<string>): Promise<CryptoKey>;
}

interface Crypto {
    readonly subtle: SubtleCrypto;
    getRandomValues(ta:TypedArray): TypedArray;
    randomUUID(): string;
}

declare const crypto: Crypto;

declare module "crypto" {

    export type Algorithm = "md5" | "sha1" | "sha256";

    export type DigestEncoding = Exclude<BufferEncoding, "utf8">;

    export interface Hash {
        /**
         * Returns a new Hash object that contains a deep copy of
         * the internal state of the current Hash object.
         */
        copy(): Hash;

        /**
         * Updates the hash content with the given `data` and returns self.
         */
        update(data: NjsStringOrBuffer): Hash;

        /**
         * Calculates the digest of all of the data passed using `hash.update()`.
         *
         * @example
         *   import cr from 'crypto'
         *   cr.createHash('sha1').update('A').update('B').digest('base64url')  // => 'BtlFlCqiamG-GMPiK_GbvKjdK10'
         *
         * @param encoding The encoding of the return value. If not provided, a `Buffer` object
         *   (or a byte string before version 0.4.4) is returned.
         * @return A calculated digest.
         */
        digest(): Buffer;
        digest(encoding: DigestEncoding): string;
    }

    export interface Hmac {
        /**
         * Updates the HMAC content with the given `data` and returns self.
         */
        update(data: NjsStringOrBuffer): Hmac;

        /**
         * Calculates the HMAC digest of all of the data passed using `hmac.update()`.
         *
         * @example
         *   import cr from 'crypto'
         *   cr.createHmac('sha1', 'secret.key').update('AB').digest('base64url')  // => 'Oglm93xn23_MkiaEq_e9u8zk374'
         *
         * @param encoding The encoding of the return value. If not provided, a `Buffer` object
         *   (or a byte string before version 0.4.4) is returned.
         * @return The calculated HMAC digest.
         */
        digest(): Buffer;
        digest(encoding: DigestEncoding): string;
    }

    interface Crypto {
        /**
         * Creates and returns a `Hash` object that can be used to generate hash digests using
         * the given `algorithm`.
         *
         * @param algorithm `'md5'`, `'sha1'`, or `'sha256'`
         * @returns A `Hash` object.
         */
        createHash(algorithm: Algorithm): Hash;

        /**
         * Creates and returns an HMAC object that uses the given `algorithm` and secret `key`.
         *
         * @param algorithm `'md5'`, `'sha1'`, or `'sha256'`
         * @param key The secret key.
         * @returns An `HMAC` object.
         */
        createHmac(algorithm: Algorithm, key: NjsStringOrBuffer): Hmac;
    }

    const crypto: Crypto;

    // It's exported like this because njs doesn't support named imports.
    // TODO: Replace NjsFS with individual named exports as soon as njs supports named imports.
    export default crypto;
}

declare module "fs" {

    /**
     * File system flag that controls opening of a file.
     *
     * - `'a'`   - Open a file for appending. The file is created if it does not exist.
     * - `'ax'`  - The same as `'a'` but fails if the file already exists.
     * - `'a+'`  - Open a file for reading and appending. If the file does not exist, it will be created.
     * - `'ax+'` - The same as `'a+'` but fails if the file already exists.
     * - `'as'`  - Open a file for appending in synchronous mode. If the file does not exist, it will be created.
     * - `'as+'` - Open a file for reading and appending in synchronous mode. If the file does not exist, it will be created.
     * - `'r'`   - Open a file for reading. An exception occurs if the file does not exist.
     * - `'r+'`  - Open a file for reading and writing. An exception occurs if the file does not exist.
     * - `'rs+'` - Open a file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
     * - `'w'`   - Open a file for writing. If the file does not exist, it will be created. If the file exists, it will be replaced.
     * - `'wx'`  - The same as `'w'` but fails if the file already exists.
     * - `'w+'`  - Open a file for reading and writing. If the file does not exist, it will be created. If the file exists, it will be replaced.
     * - `'wx+'` - The same as `'w+'` but fails if the file already exists.
     */
    export type OpenMode = "a" | "ax" | "a+" | "ax+" | "as" | "as+" | "r" | "r+" | "rs+" | "w" | "wx" | "w+" | "wx+";

    export type FileEncoding = BufferEncoding;

    /**
     * Valid types for path values in "fs".
     */
    export type PathLike = string | Buffer;

    /**
     * A representation of a directory entry - a file or a subdirectory.
     *
     * When `readdirSync()` is called with the `withFileTypes` option, the resulting array contains
     * `fs.Dirent` objects.
     */
    export interface NjsDirent {
        /**
         * @returns `true` if the object describes a block device.
         */
        isBlockDevice(): boolean;
        /**
         * @returns `true` if the object describes a character device.
         */
        isCharacterDevice(): boolean;
        /**
         * @returns `true` if the object describes a file system directory.
         */
        isDirectory(): boolean;
        /**
         * @returns `true` if the object describes a first-in-first-out (FIFO) pipe.
         */
        isFIFO(): boolean;
        /**
         * @returns `true` if the object describes a regular file.
         */
        isFile(): boolean;
        /**
         * @returns `true` if the object describes a socket.
         */
        isSocket(): boolean;
        /**
         * @returns `true` if the object describes a symbolic link.
         */
        isSymbolicLink(): boolean;

        /**
         * The name of the file this object refers to.
         */
        name: string;
    }

    /**
     * Stats object provides information about a file.
     *
     * The objects is returned from fs.stat(), fs.lstat() and friends.
     */
    export interface NjsStats {
        /**
         * @returns `true` if the object describes a block device.
         */
        isBlockDevice(): boolean;
        /**
         * @returns `true` if the object describes a character device.
         */
        isCharacterDevice(): boolean;
        /**
         * @returns `true` if the object describes a file system directory.
         */
        isDirectory(): boolean;
        /**
         * @returns `true` if the object describes a first-in-first-out (FIFO) pipe.
         */
        isFIFO(): boolean;
        /**
         * @returns `true` if the object describes a regular file.
         */
        isFile(): boolean;
        /**
         * @returns `true` if the object describes a socket.
         */
        isSocket(): boolean;
        /**
         * @returns `true` if the object describes a symbolic link.
         */
        isSymbolicLink(): boolean;

        /**
         * The numeric identifier of the device containing the file.
         */
        dev: number;

        /**
         * The file system specific "Inode" number for the file.
         */
        ino: number;

        /**
         * A bit-field describing the file type and mode.
         */
        mode: number;

        /**
         * The number of hard-links that exist for the file.
         */
        nlink: number;

        /**
         * The numeric user identifier of the user that owns the file (POSIX).
         */
        uid: number;

        /**
         * The numeric group identifier of the group that owns the file (POSIX).
         */
        gid: number;

        /**
         * A numeric device identifier if the file represents a device.
         */
        rdev: number;

        /**
         * The size of the file in bytes.
         */
        size: number;

        /**
         * The file system block size for i/o operations.
         */
        blksize: number;

        /**
         * The number of blocks allocated for this file.
         */
        blocks: number;

        /**
         * The timestamp indicating the last time this file was accessed expressed
         * in milliseconds since the POSIX Epoch.
         */
        atimeMs: number;

        /**
         * The timestamp indicating the last time this file was modified expressed
         * in milliseconds since the POSIX Epoch.
         */
        mtimeMs: number;

        /**
         * The timestamp indicating the last time this file was changed expressed
         * in milliseconds since the POSIX Epoch.
         */
        ctimeMs: number;

        /**
         * The timestamp indicating the creation time of this file expressed
         * in milliseconds since the POSIX Epoch.
         */
        birthtimeMs: number;

        /**
         * The timestamp indicating the last time this file was accessed.
         */
        atime: Date;

        /**
         * The timestamp indicating the last time this file was modified.
         */
        mtime: Date;

        /**
         * The timestamp indicating the last time this file was changed.
         */
        ctime: Date;

        /**
         * The timestamp indicating the creation time of this file.
         */
        birthtime: Date;
    }

    type WriteFileOptions = {
        mode?: number;
        flag?: OpenMode;
    };

    type NjsFsConstants = {
        /**
         * Indicates that the file is visible to the calling process, used by default if no mode
         * is specified.
         */
        F_OK: 0;
        /**
         * Indicates that the file can be read by the calling process.
         */
        R_OK: 4;
        /**
         * Indicates that the file can be written by the calling process.
         */
        W_OK: 2;
        /**
         * Indicates that the file can be executed by the calling process.
         */
        X_OK: 1;
    };

    interface NjsFsPromises {
        /**
         * Asynchronously tests permissions for a file or directory specified in the `path`.
         * If the check fails, an error will be returned, otherwise, the method will return undefined.
         *
         * @example
         *   import fs from 'fs'
         *   fs.promises.access('/file/path', fs.constants.R_OK | fs.constants.W_OK)
         *     .then(() => console.log('has access'))
         *     .catch(() => console.log('no access'))
         *
         * @since 0.3.9
         * @param path A path to a file or directory.
         * @param mode An optional integer that specifies the accessibility checks to be performed.
         *   Defaults to `fs.constants.F_OK`.
         */
        access(path: PathLike, mode?: number): Promise<void>;

        /**
         * Asynchronously opens a file specified in the `path`.
         *
         * @example
         *   import fs from 'fs'
         *   let fh = await fs.promises.open('/file/path', 'w');
         *   let bw = await fh.write("data to write", 10);
         *
         * @since 0.7.7
         * @param path A path to a file.
         * @param flags File system flags, defaults to `r`.
         * @param mode The file mode, defaults to 0o666.
         */
        open(path: PathLike, flags?: OpenMode, mode?: number): Promise<NjsFsFileHandle>;

        /**
         * Asynchronously appends specified `data` to a file with provided `filename`.
         * If the file does not exist, it will be created.
         *
         * @since 0.4.4
         * @param path A path to a file.
         * @param data The data to write.
         * @param options An object optionally specifying the file mode and flag.
         *   If `mode` is not supplied, the default of `0o666` is used.
         *   If `flag` is not supplied, the default of `'a'` is used.
         */
        appendFile(path: PathLike, data: NjsStringOrBuffer, options?: WriteFileOptions): Promise<void>;

        /**
         * Asynchronously retrieves `fs.Stats` object for the symbolic link referred to by `path`.
         * See `lstat(2)` for more details.
         *
         * @since 0.7.1
         * @param path A path to a file.
         * @param options An object with the following optional keys:
         *   - `throwIfNoEntry` - Whether an exception will be thrown if no file system entry exists,
         *      rather than returning undefined, defaults to `true`.
         */
        lstat(path: PathLike, options?: { throwIfNoEntry?: boolean; }): Promise<NjsStats>;

        /**
         * Asynchronously creates a directory at the specified `path`.
         *
         * @since 0.4.2
         * @param path A path to a file.
         * @param options A number specifying file mode, defaults to `0o777`.
         * @param options An object with the following optional keys:
         *   - `mode` - A number specifying file mode, defaults to `0o777`.
         *   - `recursive` -  If true, perform a recursive directory creation, defaults to `false`.
         */
        mkdir(path: PathLike, options?: { mode?: number; recursive?: boolean; } | number): Promise<void>;

        /**
         * Asynchronously reads the contents of a directory at the specified `path`.
         *
         * @since 0.4.2
         * @param path A path to a file.
         * @param options A string that specifies encoding or an object optionally specifying
         *   the following keys:
         *   - `encoding` - `'utf8'` (default) or `'buffer'` (since 0.4.4)
         *   - `withFileTypes` - if set to `true`, the files array will contain `fs.Dirent` objects; defaults to `false`.
         */
        readdir(path: PathLike, options?: { encoding?: "utf8"; withFileTypes?: false; } | "utf8"): Promise<string[]>;
        readdir(path: PathLike, options: { encoding: "buffer"; withFileTypes?: false; } | "buffer"): Promise<Buffer[]>;
        readdir(path: PathLike, options: { encoding?: "utf8" | "buffer"; withFileTypes: true; }): Promise<NjsDirent[]>;

        /**
         * Asynchronously returns the contents of the file with provided `filename`.
         * If an encoding is specified, a `string` is returned, otherwise, a `Buffer`.
         *
         * @param path A path to a file.
         * @param options A string that specifies encoding or an object with the following optional keys:
         *   - `encoding` - `'utf8'`, `'hex'`, `'base64'`, or `'base64url'` (the last three since 0.4.4).
         *   - `flag` - file system flag, defaults to `r`.
         */
        readFile(path: PathLike): Promise<Buffer>;
        readFile(path: PathLike, options?: { flag?: OpenMode; }): Promise<Buffer>;
        readFile(path: PathLike, options: { encoding?: FileEncoding; flag?: OpenMode; } | FileEncoding): Promise<string>;

        /**
         * Asynchronously computes the canonical pathname by resolving `.`, `..` and symbolic links using
         * `realpath(3)`.
         *
         * @since 0.3.9
         * @param path A path to a file.
         * @param options The encoding (or an object specifying the encoding), used as the encoding of the result.
         */
        realpath(path: PathLike, options?: { encoding?: "utf8" } | "utf8"): Promise<string>;
        realpath(path: PathLike, options: { encoding: "buffer" } | "buffer"): Promise<Buffer>;

        /**
         * Asynchronously changes the name or location of a file from `oldPath` to `newPath`.
         *
         * @since 0.3.4
         * @param oldPath A path to a file.
         * @param newPath A path to a file.
         */
        rename(oldPath: PathLike, newPath: PathLike): Promise<void>;

        /**
         * Asynchronously removes a directory at the specified `path`.
         *
         * @since 0.4.2
         * @param path A path to a file.
         * @param options An object with the following optional keys:
         *   - `recursive` -  If true, perform a recursive directory removal, defaults to `false`.
         */
        rmdir(path: PathLike, options?: { recursive?: boolean; }): Promise<void>;

        /**
         * Asynchronously retrieves `fs.Stats` object for the specified `path`.
         *
         * @since 0.7.1
         * @param path A path to a file.
         * @param options An object with the following optional keys:
         *   - `throwIfNoEntry` - Whether an exception will be thrown if no file system entry exists,
         *      rather than returning undefined, defaults to `true`.
         */
        stat(path: PathLike, options?: { throwIfNoEntry?: boolean; }): Promise<NjsStats>;

        /**
         * Asynchronously creates the link called `path` pointing to `target` using `symlink(2)`.
         * Relative targets are relative to the link’s parent directory.
         *
         * @since 0.3.9
         * @param target A path to an existing file.
         * @param path A path to the new symlink.
         */
        symlink(target: PathLike, path: PathLike): Promise<void>;

        /**
         * Asynchronously unlinks a file by `path`.
         *
         * @since 0.3.9
         * @param path A path to a file.
         */
        unlink(path: PathLike): Promise<void>;

        /**
         * Asynchronously writes `data` to a file with provided `filename`. If the file does not
         * exist, it will be created, if the file exists, it will be replaced.
         *
         * @since 0.4.4
         * @param path A path to a file.
         * @param data The data to write.
         * @param options An object optionally specifying the file mode and flag.
         *   If `mode` is not supplied, the default of `0o666` is used.
         *   If `flag` is not supplied, the default of `'w'` is used.
         */
        writeFile(path: PathLike, data: NjsStringOrBuffer, options?: WriteFileOptions): Promise<void>;
    }

    interface NjsFsBytesRead {
        /**
         * The number of bytes read.
         */
        bytesRead: number;

        /**
         * A reference to the passed in buffer argument.
         */
        buffer: NjsBuffer;
    }

    interface NjsFsBytesWritten {
        /**
         * The number of bytes written.
         */
        bytesWritten: number;

        /**
         * A reference to the buffer written.
         */
        buffer: NjsBuffer;
    }

    interface NjsFsFileHandle {
        /**
         * Asynchronously closes the file handle after waiting for any pending operation
         * on the handle to complete.
         */
        close(): Promise<void>;

        /**
         * The file descriptor number.
         */
        fd: number;

        /**
         * Asynchronously reads data from the file and stores that in the given buffer.
         *
         * @param buffer A buffer that will be filled with the file data read.
         * @param offset The location in the buffer at which to start filling.
         * @param length The number of bytes to read.
         * @param position The location where to begin reading data from the file.
         *    If null, data will be read from the current file position, and the position will be updated.
         *    If position is an integer, the current file position will remain unchanged.
         */
        read(buffer: NjsBuffer, offset: number, length: number, position: number | null): Promise<NjsFsBytesRead>;

        /**
         * Asynchronously retrieves `fs.Stats` for the underlying descriptor.
         */
        stat(): Promise<NjsStats>;

        /**
         * Asynchronously writes buffer to the file.
         *
         * @param buffer A buffer to write.
         * @param offset The start position from within buffer where the data to write begins.
         * @param The number of bytes from buffer to write.
         *    Defaults to buffer.byteLength - offset
         * @param position The offset from the beginning of the file where the data from buffer
         *    should be written. If position is not a number, the data will be written at the current position.
         * @param encoding  One of the `'utf8'`, `'hex'`, `'base64'`, or `'base64url'`.
         *    Defaults to 'utf8'.
         */
        write(buffer: NjsBuffer, offset: number, length?: number, position?: number | null): Promise<NjsFsBytesWritten>;
        write(buffer: string, position?: number | null, encoding?: FileEncoding): Promise<NjsFsBytesWritten>;
    }

    interface NjsFS {
        /**
         * Promissified versions of file system methods.
         *
         * @since 0.3.9
         */
        promises: NjsFsPromises

        /**
         * Synchronously closes specified file descriptor.
         *
         * @since 0.7.7
         * @param fd A file descriptor.
         */
        closeSync(fd: number): undefined;

        /**
         * File Access Constants
         */
        constants: NjsFsConstants

        /**
         * Synchronously tests permissions for a file or directory specified in the `path`.
         * If the check fails, an error will be returned, otherwise, the method will return undefined.
         *
         * @example
         *   try {
         *     fs.accessSync('/file/path', fs.constants.R_OK | fs.constants.W_OK);
         *     console.log('has access');
         *   } catch (e) {
         *     console.log('no access');
         *   }
         *
         * @since 0.3.9
         * @param path A path to a file or directory.
         * @param mode An optional integer that specifies the accessibility checks to be performed.
         *   Defaults to `fs.constants.F_OK`.
         */
        accessSync(path: PathLike, mode?: number): void;

        /**
         * Synchronously appends specified `data` to a file with provided `filename`.
         * If the file does not exist, it will be created.
         *
         * @since 0.4.4
         * @param path A path to a file.
         * @param data The data to write.
         * @param options An object optionally specifying the file mode and flag.
         *   If `mode` is not supplied, the default of `0o666` is used.
         *   If `flag` is not supplied, the default of `'a'` is used.
         */
        appendFileSync(path: PathLike, data: NjsStringOrBuffer, options?: WriteFileOptions): void;

        /**
         * Synchronously retrieves `fs.Stats` object for specified file descriptor.
         *
         * @since 0.7.7
         * @param fd A file descriptor.
         */
        fstatSync(fd: number): NjsStats;

        /**
         * Synchronously retrieves `fs.Stats` object for the symbolic link referred to by path.
         * See `lstat(2)` for more details.
         *
         * @since 0.7.1
         * @param path A path to a file.
         * @param options An object with the following optional keys:
         *   - `throwIfNoEntry` - Whether an exception will be thrown if no file system entry exists,
         *      rather than returning undefined, defaults to `true`.
         */
        lstatSync(path: PathLike, options?: { throwIfNoEntry?: boolean; }): NjsStats;

        /**
         * Synchronously creates a directory at the specified `path`.
         *
         * @since 0.4.2
         * @param path A path to a file.
         * @param options A number specifying file mode. defaults to `0o777`.
         * @param options An object with the following optional keys:
         *   - `mode` - A number specifying file mode, defaults to `0o777`.
         *   - `recursive` -  If true, perform a recursive directory creation, defaults to `false`.
         */
        mkdirSync(path: PathLike, options?: { mode?: number; recursive?: boolean; } | number): void;

        /**
         * Synchronously opens a file specified in the `path`.
         *
         * @example
         *   import fs from 'fs'
         *   let fd = fs.openSync('/file/path', 'w');
         *   let bytesWritten = fs.writeSync("data to write", 10);
         *
         * @since 0.7.7
         * @param path A path to a file.
         * @param flags file system flags, defaults to `r`.
         * @param mode Thre file mode, defaults to 0o666.
         */
        openSync(path: PathLike, flags?: OpenMode, mode?: number): number;

        /**
         * Synchronously reads the contents of a directory at the specified `path`.
         *
         * @since 0.4.2
         * @param path A path to a file.
         * @param options A string that specifies encoding or an object optionally specifying
         *   the following keys:
         *   - `encoding` - `'utf8'` (default) or `'buffer'` (since 0.4.4)
         *   - `withFileTypes` - if set to `true`, the files array will contain `fs.Dirent` objects;
         *     defaults to `false`.
         */
        readdirSync(path: PathLike, options?: { encoding?: "utf8"; withFileTypes?: false; } | "utf8"): string[];
        readdirSync(path: PathLike, options: { encoding: "buffer"; withFileTypes?: false; } | "buffer"): Buffer[];
        readdirSync(path: PathLike, options: { encoding?: "utf8" | "buffer"; withFileTypes: true; }): NjsDirent[];

        /**
         * Synchronously returns the contents of the file with provided `filename`.
         * If an encoding is specified, a `string` is returned, otherwise, a `Buffer`.
         *
         * @example
         *   import fs from 'fs'
         *   var file = fs.readFileSync('/file/path.tar.gz')
         *   var gzipped = file.slice(0,2).toString('hex') === '1f8b'; gzipped  // => true
         *
         * @param path A path to a file.
         * @param options A string that specifies encoding or an object with the following optional keys:
         *   - `encoding` - `'utf8'`, `'hex'`, `'base64'`, or `'base64url'` (the last three since 0.4.4).
         *   - `flag` - file system flag, defaults to `r`.
         */
        readFileSync(path: PathLike): Buffer;
        readFileSync(path: PathLike, options?: { flag?: OpenMode; }): Buffer;
        readFileSync(path: PathLike, options: { encoding?: FileEncoding; flag?: OpenMode; } | FileEncoding): string;

        /**
         * Synchronously reads data from the file and stores that in the given buffer.
         *
         * @since 0.7.7
         * @param fd A file descriptor.
         * @param buffer A buffer that will be filled with the file data read.
         * @param offset The location in the buffer at which to start filling.
         * @param length The number of bytes to read.
         * @param position The location where to begin reading data from the file.
         *    If null, data will be read from the current file position, and the position will be updated.
         *    If position is an integer, the current file position will remain unchanged.
         * @param encoding  One of the `'utf8'`, `'hex'`, `'base64'`, or `'base64url'`.
         *    Defaults to 'utf8'.
         */
        readSync(fd: number, buffer: NjsBuffer, offset: number, length?: number, position?: number | null): number;
        readSync(fd: number, string: string, position?: number | null, encoding?: FileEncoding): number;

        /**
         * Synchronously computes the canonical pathname by resolving `.`, `..` and symbolic links using
         * `realpath(3)`.
         *
         * @since 0.3.9
         * @param path A path to a file.
         * @param options The encoding (or an object specifying the encoding), used as the encoding of the result.
         */
        realpathSync(path: PathLike, options?: { encoding?: "utf8" } | "utf8"): string;
        realpathSync(path: PathLike, options: { encoding: "buffer" } | "buffer"): Buffer;

        /**
         * Synchronously changes the name or location of a file from `oldPath` to `newPath`.
         *
         * @example
         *   import fs from 'fs'
         *   var file = fs.renameSync('hello.txt', 'HelloWorld.txt')
         *
         * @since 0.3.4
         * @param oldPath A path to a file.
         * @param newPath A path to a file.
         */
        renameSync(oldPath: PathLike, newPath: PathLike): void;

        /**
         * Synchronously removes a directory at the specified `path`.
         *
         * @since 0.4.2
         * @param path A path to a file.
         * @param options An object with the following optional keys:
         *   - `recursive` -  If true, perform a recursive directory removal, defaults to `false`.
         */
        rmdirSync(path: PathLike, options?: { recursive?: boolean; }): void;

        /**
         * Synchronously retrieves `fs.Stats` object for the specified path.
         *
         * @since 0.7.1
         * @param path A path to a file.
         * @param options An object with the following optional keys:
         *   - `throwIfNoEntry` - Whether an exception will be thrown if no file system entry exists,
         *      rather than returning undefined, defaults to `true`.
         */
        statSync(path: PathLike, options?: { throwIfNoEntry?: boolean; }): NjsStats;

        /**
         * Synchronously creates the link called `path` pointing to `target` using `symlink(2)`.
         * Relative targets are relative to the link’s parent directory.
         *
         * @since 0.3.9
         * @param target A path to an existing file.
         * @param path A path to the new symlink.
         */
        symlinkSync(target: PathLike, path: PathLike): void;

        /**
         * Synchronously unlinks a file by `path`.
         *
         * @since 0.3.9
         * @param path A path to a file.
         */
        unlinkSync(path: PathLike): void;

        /**
         * Synchronously writes `data` to a file with provided `filename`. If the file does not exist,
         * it will be created, if the file exists, it will be replaced.
         *
         * @example
         *   import fs from 'fs'
         *   fs.writeFileSync('hello.txt', 'Hello world')
         *
         * @since 0.4.4
         * @param path A path to a file.
         * @param data The data to write.
         * @param options An object optionally specifying the file mode and flag.
         *   If `mode` is not supplied, the default of `0o666` is used.
         *   If `flag` is not supplied, the default of `'w'` is used.
         */
        writeFileSync(path: PathLike, data: NjsStringOrBuffer, options?: WriteFileOptions): void;

        /**
         * Synchronously writes `buffer` data to a file.
         *
         * @since 0.7.7
         * @param fd A file descriptor.
         * @param buffer A buffer that will be filled with the file data read.
         * @param offset The location in the buffer at which to start filling.
         * @param length The number of bytes to read.
         * @param position The location where to begin reading data from the file.
         *    If null, data will be read from the current file position, and the position will be updated.
         *    If position is an integer, the current file position will remain unchanged.
         * @param encoding  One of the `'utf8'`, `'hex'`, `'base64'`, or `'base64url'`.
         *    Defaults to 'utf8'.
         */
        writeSync(fd: number, buffer: NjsBuffer, offset: number, length?: number, position?: number | null): number;
        writeSync(fd: number, string: string, position?: number | null, encoding?: FileEncoding): number;
    }

    const fs: NjsFS;

    // It's exported like this because njs doesn't support named imports.
    // TODO: Replace NjsFS with individual named exports as soon as njs supports named imports.
    export default fs;
}

declare module "querystring" {

    export interface ParsedUrlQuery {
        [key: string]: string | string[] | undefined;
    }

    export interface ParsedUrlQueryInput {
        [key: string]: string | number | boolean | string[] | number[] | boolean[] | null | undefined;
    }

    interface ParseOptions {
        /**
         * Function used to decode percent-encoded characters in the query string.
         * Defaults to `querystring.unescape()`.
         */
        decodeURIComponent?: (str: string) => string;

        /**
         * The maximum number of keys to parse; defaults to `1000`.
         * The `0` value removes limitations for counting keys.
         */
        maxKeys?: number;
    }

    interface StringifyOptions {
        /**
         * The function to use when converting URL-unsafe characters to percent-encoding in the
         * query string; defaults to `querystring.escape()`.
         */
        encodeURIComponent?: (str: string) => string;
    }

    interface QueryString {
        /**
         * Performs URL encoding of the given string `str`, returns an escaped query string.
         * The method is used by `querystring.stringify()` and should not be used directly.
         *
         * @param str The query string to escape.
         * @return The escaped query string.
         */
        escape(str: string): string;

        /**
         * Parses the query string URL and returns an object.
         *
         * By default, percent-encoded characters within the query string are assumed to use the
         * UTF-8 encoding, invalid UTF-8 sequences will be replaced with the `U+FFFD` replacement
         * character.
         *
         * @param query The query string.
         * @param separator The substring for delimiting key and value pairs in the query string; defaults to `'&'`.
         * @param equal The substring for delimiting keys and values in the query string, defaults to `'='`.
         * @param options An object optionally specifying `decodeURIComponent` function and `maxKeys` number.
         * @return An object containing the components of the query string.
         */
        parse(query: string, separator?: string, equal?: string, options?: ParseOptions): ParsedUrlQuery;

        /**
         * An alias for `querystring.parse()`.
         */
        decode(query: string, separator?: string, equal?: string, options?: ParseOptions): ParsedUrlQuery;

        /**
         * Serializes an object and returns a URL query string.
         *
         * By default, characters that require percent-encoding within the query string are encoded
         * as UTF-8. If other encoding is required, then `encodeURIComponent` option should be
         * specified.
         *
         * @param obj The data to convert to a query string.
         * @param separator The substring for delimiting key and value pairs in the query string; defaults to `'&'`.
         * @param equal The substring for delimiting keys and values in the query string; defaults to `'='`.
         * @param options An object optionally specifying `encodeURIComponent` function.
         * @return A query string.
         */
        stringify(obj: ParsedUrlQueryInput, separator?: string, equal?: string, options?: StringifyOptions): string;

        /**
         * An alias for `querystring.stringify()`.
         */
        encode(obj: ParsedUrlQueryInput, separator?: string, equal?: string, options?: StringifyOptions): string;

        /**
         * Performs decoding of URL percent-encoded characters of the string `str`, returns an
         * unescaped query string. The method is used by `querystring.parse()` and should not be
         * used directly.
         *
         * @param str An escaped query string.
         * @return An unescaped string.
         */
        unescape(str: string): string;
    }

    const querystring: QueryString;

    // It's exported like this because njs doesn't support named imports.
    // TODO: Replace NjsFS with individual named exports as soon as njs supports named imports.
    export default querystring;
}

declare module "xml" {

    export interface XMLDoc {
        /**
         * The doc's root node.
         */
        readonly $root: XMLNode;

        /**
         * The doc's root by its name or undefined.
         */
        readonly [rootTagName: string]: XMLNode | undefined;
    }

    export interface XMLNode {
        /**
         * Adds a child node. Node is recursively copied before adding.
         * @param node - XMLNode to be added.
         * @since 0.7.11.
         */
        addChild(node: XMLNode): void;

        /**
         * node.$attr$xxx - value of the node's attribute "xxx".
         * @since 0.7.11 the property is writable.
         */
        [key: `$attr$${string}`]: string | undefined;

        /**
         * Removes attribute by name.
         * @param name - name of the attribute to remove.
         * @since 0.7.11.
         */
        removeAttribute(name: string): void;

        /**
         * Removes all the attribute of the node.
         * @since 0.7.11.
         */
        removeAllAttributes(): void;

        /**
         * Removes all the children tags named tag_name.
         * @param tag_name - name of the children's tags to remove.
         * If tag_name is absent all children tags are removed.
         * @since 0.7.11.
         */
        removeChildren(tag_name?:string): void;

        /**
         * Removes the text value of the node.
         * @since 0.7.11.
         */
        removeText(): void;

        /**
         * Sets a value for the attribute.
         * @param attr_name - name of the attribute to set.
         * @param value - value of the attribute to set. When value is null
         * the attribute is removed.
         * @since 0.7.11.
         */
        setAttribute(attr_name: string, value: string | null): void;

        /**
         * Sets a text value for the node.
         * @param text - a value to set as a text. If value is null the
         * node's text is deleted.
         * @since 0.7.11.
         */
        setText(text:string | null): void;

        /**
         * node.$attrs - an XMLAttr wrapper object for all the attributes
         * of the node.
         */
        readonly $attrs: XMLAttr;

        /**
         * node.$tag$xxx - the node's first child tag named "xxx".
         * @since 0.7.11 the property is writable.
         */
        [key: `$tag$${string}`]: XMLNode | undefined;

        /**
         * node.$tags$xxx - all children tags named "xxx" of the node.
         * @since 0.7.11 the property is writable.
         */
        [key: `$tags$${string}`]: XMLNode[] | undefined;

        /**
         * node.$name - the name of the node.
         */
        readonly $name: string;

        /**
         * node.$ns - the namespace of the node.
         */
        readonly $ns: string;

        /**
         * node.$parent - the parent node of the current node.
         */
        readonly $parent: string;

        /**
         * node.$text - the content of the node.
         * @since 0.7.11 the property is writable.
         */
        $text: string;

        /**
         * node.$tags - all the node's children tags.
         */
        $tags: XMLNode[] | undefined;
    }

    export interface XMLAttr {
        /**
         * attr.xxx is the attribute value of "xxx".
         */
        readonly [key: string]: string | undefined;
    }

    interface Xml {
        /**
         * Canonicalizes root_node and its children according to
         * https://www.w3.org/TR/xml-c14n/.
         *
         * @param root - XMLDoc or XMLNode.
         * @return Buffer object containing canonicalized output.
         */
        c14n(root: XMLDoc | XMLNode): Buffer;

        /**
         * Parses src buffer for an XML document and returns a wrapper object.
         *
         * @param src a string or a buffer with an XML document.
         * @return A XMLDoc wrapper object representing the parsed XML document.
         */
        parse(src: string): XMLDoc;

        /**
         * Canonicalizes root_node and its children according to
         * https://www.w3.org/tr/xml-exc-c14n/.
         *
         * @param root - XMLDoc or XMLNode.
         * @param excluding_node - allows to omit from the output a part of the
         * document corresponding to the excluding_node and its children.
         * @param withComments - a boolean (false by default). when withComments
         * is true canonicalization corresponds to
         * http://www.w3.org/2001/10/xml-exc-c14n#WithComments.
         * @param prefix_list - an optional string with a space separated namespace
         * prefixes for namespaces that should also be included into the output.
         * @return buffer object containing canonicalized output.
         */
        exclusiveC14n(root: XMLDoc | XMLNode, excluding_node?: XMLNode | null | undefined,
                      withComments?: boolean, prefix_list?: string): Buffer;

        /**
         * The alias to xml.x14n()
         * @since 0.7.11
         */
        serialize(root: XMLDoc | XMLNode): Buffer;

        /**
         * The same as xml.x14n() but returns the retval as a string.
         * @since 0.7.11
         */
        serializeToString(root: XMLDoc | XMLNode): string;
    }

    const xml: Xml;

    export default xml;
}

declare module "zlib" {
    interface NjsZlibOptions {
        /**
         * the buffer size for feeding data to and pulling data
         * from the zlib routines, defaults to 1024.
         */
        chunkSize?: number;

        /**
         * The dictionary buffer.
         */
        dictionary?: NjsStringOrBuffer;

        /**
         * Compression level, from zlib.constants.Z_NO_COMPRESSION to
         * zlib.constants.Z_BEST_COMPRESSION. Defaults to
         * zlib.constants.Z_DEFAULT_COMPRESSION.
         */
        level?: number;

        /**
         * Specifies how much memory should be allocated for the internal compression state.
         * 1 uses minimum memory but is slow and reduces compression ratio;
         * 9 uses maximum memory for optimal speed.
         * The default value is 8.
         */
        memLevel?: number;

        /**
         * The compression strategy, defaults to zlib.constants.Z_DEFAULT_STRATEGY.
         */
        strategy?: number;

        /**
         * The log2 of window size.
         * -15 to -9 for raw data, from 9 to 15 for an ordinary stream.
         */
        windowBits?: number;
    }

    type NjsZlibConstants = {
        /**
         * No compression.
         */
        Z_NO_COMPRESSION: number;

        /**
         * Fastest, produces the least compression.
         */
        Z_BEST_SPEED: number;

        /**
         * Trade-off between speed and compression.
         */
        Z_DEFAULT_COMPRESSION: number;

        /**
         * Slowest, produces the most compression.
         */
        Z_BEST_COMPRESSION: number;

        /**
         * Filtered strategy: for the data produced by a filter or predictor.
         */
        Z_FILTERED: number;

        /**
         * Huffman-only strategy: only Huffman encoding, no string matching.
         */
        Z_HUFFMAN_ONLY: number;

        /**
         * Run Length Encoding strategy: limit match distances to one,
         * better compression of PNG image data.
         */
        Z_RLE: number;

        /**
         * Fixed table strategy: prevents the use of dynamic Huffman codes,
         * a simpler decoder for special applications.
         */
        Z_FIXED: number;

        /**
         * Default strategy, suitable for general purpose compression.
         */
        Z_DEFAULT_STRATEGY: number;
    };

    interface Zlib {
        /**
         * Compresses data using deflate, and do not append a zlib header.
         *
         * @param data - The data to be compressed.
         */
        deflateRawSync(data: NjsStringOrBuffer, options?:NjsZlibOptions): Buffer;

        /**
         * Compresses data using deflate.
         *
         * @param data - The data to be compressed.
         */
        deflateSync(data: NjsStringOrBuffer, options?:NjsZlibOptions): Buffer;

        /**
         * Decompresses a raw deflate stream.
         *
         * @param data - The data to be decompressed.
         */
        inflateRawSync(data: NjsStringOrBuffer, options?:NjsZlibOptions): Buffer;

        /**
         * Decompresses a deflate stream.
         *
         * @param data - The data to be decompressed.
         */
        inflateSync(data: NjsStringOrBuffer, options?:NjsZlibOptions): Buffer;

        constants: NjsZlibConstants;
    }

    const zlib: Zlib;

    export default zlib;
}
