import request from "../../requestV2";
import Promise from "../../PromiseV2";
import { CleanPrefix } from "./constants";

class ApiWrapper {
  constructor() {
    this.endpoints = {
      SKYCRYPT: "https://sky.shiiyu.moe/api/v2",
      HYPIXEL: "https://api.hypixel.net/v2",
      MOULBERRY: "https://moulberry.codes",
      ALPHA: "https://api.mcsrvstat.us/2/alpha.hypixel.net",
    };

    this.cacheConfig = {
      enabled: false, // Enable caching here
      duration: 5 * 60 * 1000, // 5 minutes default
      data: new Map(),
    };

    // Request queue configuration
    this.requestQueue = [];
    this.maxConcurrent = 2; // Maximum concurrent requests to SkyCrypt
    this.activeRequests = 0;
  }

  processNextRequest() {
    var self = this;
    if (this.requestQueue.length === 0) return;
    if (this.activeRequests >= this.maxConcurrent) return;

    var nextRequest = this.requestQueue.shift();
    this.activeRequests++;

    nextRequest
      .func()
      .then(function (result) {
        nextRequest.resolve(result);
        self.activeRequests--;
        self.processNextRequest();
      })
      .catch(function (error) {
        nextRequest.resolve({
          success: false,
          error: { status: "Request failed", error },
        });
        self.activeRequests--;
        self.processNextRequest();
      });
  }

  queueRequest(requestFunc) {
    var self = this;
    return new Promise(function (resolve) {
      self.requestQueue.push({
        func: requestFunc,
        resolve: resolve,
      });
      self.processNextRequest();
    });
  }

  makeRequest(url, options) {
    var self = this;

    var requestFunc = function () {
      return new Promise(function (resolve) {
        var headers = {
          "User-Agent": "Mozilla/5.0",
        };

        if (options && options.headers) {
          Object.keys(options.headers).forEach(function (key) {
            headers[key] = options.headers[key];
          });
        }

        var requestOptions = {
          url: url,
          method: options && options.method ? options.method : "GET",
          headers: headers,
        };

        if (options && options.body) {
          requestOptions.body = options.body;
        }

        var cacheKey = url;

        if (self.cacheConfig.enabled && (!url.includes("sky.shiiyu.moe") || !options || !options.forceUpdate)) {
          var cachedData = self.getCachedData(cacheKey);
          if (cachedData) {
            resolve(cachedData);
            return;
          }
        }

        request(requestOptions)
          .then(function (response) {
            try {
              var data = JSON.parse(response);

              if (self.cacheConfig.enabled) {
                self.setCachedData(cacheKey, {
                  success: true,
                  data: data,
                });
              }

              resolve({
                success: true,
                data: data,
              });
            } catch (error) {
              console.error(CleanPrefix + " Error processing API response:", error);
              resolve({
                success: false,
                error: "Failed to process API response",
              });
            }
          })
          .catch(function (error) {
            console.error(CleanPrefix + " Error making API request:", error);
            resolve({
              success: false,
              error: "Failed to make API request",
            });
          });
      });
    };

    // Queue requests only for SkyCrypt API
    if (url.includes("sky.shiiyu.moe")) {
      return this.queueRequest(requestFunc);
    }
    return requestFunc();
  }

  getCachedData(key) {
    var cached = this.cacheConfig.data.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheConfig.duration) {
      return cached.data;
    }
    this.cacheConfig.data.delete(key);
    return null;
  }

  setCachedData(key, data) {
    this.cacheConfig.data.set(key, {
      timestamp: Date.now(),
      data: data,
    });
  }

  clearCache() {
    this.cacheConfig.data.clear();
  }

  forceSkyCryptUpdate(username) {
    // Simulate website visit to trigger update
    var statsUrl = "https://sky.shiiyu.moe/stats/" + username;

    // Don't queue these requests as they're just triggers
    return new Promise(function (resolve) {
      request({
        url: statsUrl,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0",
          // Add headers to better simulate a browser visit
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Connection: "keep-alive",
        },
      })
        .then(function () {
          resolve(true);
        })
        .catch(function (error) {
          console.error(CleanPrefix + " Error triggering SkyCrypt update:", error);
          resolve(false);
        });
    });
  }

  getSkyCryptProfile(username, forceUpdate) {
    var url = this.endpoints.SKYCRYPT + "/profile/" + username;

    if (!forceUpdate) {
      return this.makeRequest(url);
    }

    // Make both requests nearly simultaneously
    this.forceSkyCryptUpdate(username);
    return this.makeRequest(url);
  }

  getSkyCryptSlayers(username, forceUpdate) {
    var url = this.endpoints.SKYCRYPT + "/slayers/" + username;

    if (!forceUpdate) {
      return this.makeRequest(url);
    }

    this.forceSkyCryptUpdate(username);
    return this.makeRequest(url);
  }

  getSkyCryptDungeons(username, forceUpdate) {
    var url = this.endpoints.SKYCRYPT + "/dungeons/" + username;

    if (!forceUpdate) {
      return this.makeRequest(url);
    }

    this.forceSkyCryptUpdate(username);
    return this.makeRequest(url);
  }

  getHypixelElection() {
    var url = this.endpoints.HYPIXEL + "/resources/skyblock/election";
    return this.makeRequest(url);
  }

  getMoulberryLowestBin() {
    var url = this.endpoints.MOULBERRY + "/lowestbin.json";
    return this.makeRequest(url);
  }

  getAlphaStatus() {
    return this.makeRequest(this.endpoints.ALPHA);
  }
}

// Export singleton instance
export default new ApiWrapper();
