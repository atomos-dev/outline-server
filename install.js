const fs = require("fs");
const crypto = require("crypto");
const keys = {
  public: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqSD7ftUrjGxbp6glYvSh
Gfos3LTYgy3PeRtw6TDAJxTkIEduprNHQf5guVb+HMiLeJcdjc4GvIbusv7XEEXp
aVe+yXvfLQjlBzHBu0XqTHUBSpAbUwrSxgoRWxmJIcFn5/SOa0j6GcVNPYpTZbc/
2giq32pwY/O9mAjW3HQu2uzV3s2PwBiD3P2qygyr2pUZRQibKHNQk+Rmj5YBJ9Um
kKLwgYn55Wr8ktA40mxz2M15MtAjO0vv6JvsLhnOOEH7KJQyo+sdl2qMsDmsBvdW
R8iRoz6N7w9Q6OovP+pFLXfockL9GJYD341HRl8IMPMAKykUyjFwfD3trMqlH/Cx
Y7kAZT4cRZa7/4jnRIbMXqOyrkLHIy2laHSTk77LdSfJHf7yqVijoCa5yhKbMU1g
pOcM4gtsnIyU94qZqd6nRxTyozHDNdEMswBPmYLnvjyRZ7jD0fXWBFLEEZGCttl2
zztyGC0o76QgJyfOx8equc1li0NTXJxl1RzVw6GyAYHP7sEoNBWjWwwSxKDUTSZ+
1pfcmdS5oh9rESPWV9onDzqXLEvWgc6knS2ChIZe71r/1XYnaaX8ZkMzi4w7nXWO
VSS7y/OttWNiEdufFm0XGq9p9CtcNf7RGbvTDEiq/Ma0q3DXXsnuFfsw0186sO08
iR/ER66ziRvIocwb7jh0TFMCAwEAAQ==
-----END PUBLIC KEY-----`,
  private: `-----BEGIN PRIVATE KEY-----
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
nn5EDmZPeY1gDZQd9OYaOAawMtpdD8U=
-----END PRIVATE KEY-----`,
};

const string = crypto
  .publicEncrypt(
    keys.public,
    Buffer.from(
      JSON.stringify({
        api: "https://64.180.114.39:22272/OLWEgrCtWbJRQb6Z0NyMdA",
        ip: "64.180.114.39",
        port: "7891",
        name: "Mini 64.180.114.39",
        cert: JSON.parse(fs.readFileSync("/root/test/test/")),
      }),
      "utf-8"
    )
  )
  .toString("base64");

console.log(string);
console.log(
  JSON.stringify({
    api: "https://64.180.114.39:22272/OLWEgrCtWbJRQb6Z0NyMdA",
    ip: "64.180.114.39",
    port: "7891",
    name: "Mini 64.180.114.39",
  })
);
console.log(
  crypto
    .privateDecrypt(
      keys.private,
      Buffer.from(
        "XvUXRanhgtXEzw4OpABijBfoSMRDKpHXrpsToa1YbpB5Xm6bDpIW2fxkq9N1omIVQNX6Cut30lEJhos4LC2k5pjkFoSsgf8NwRoM1cm1hhd795AVkcSOpLbVaBbamggaLhrecN5n0bBB9A3ClMA48X4hZljCpHfLb+ikBVu+ForG6iiK/EXg7i6watxzvMTidIAhvzpMWBhjqORP7AVbwJ44MQBvpTr2fEsgTUt0EsZcGwjlxWqyk1n7i79NoOcnGZlhyY3iU9Zn0Zj7lMqJgmQH0rmidBiFSYTlKqE9IGsH6+KWc+EKc2eS28czazuVo2vkmtmX1/Bah1watSzX7+sjJKVgAZYIWo+4ely0RpyaS3J1Qu53ZqdoOzf46x7KPoO6FgD1gIfCZeCV6O03iei/S2Rj5nzfpuueohSslSWXg4v0z9JnQnjIyIuu7xdBjFWFY6JzoeO2dyALDmW9kz9GzaKnAEAUY6d/cwRgBOtTw3vczo6fxeqlcfgmUA2k42s5OOhLhJ7Np4SLo309DdP3q6dhZSUXLDLaqiFoi65pIWIvL1t2uH7kYQ93N87VTyl8UWGXCJmRd141A6HZO9EQqwCmb/JQiZ2H3Q+MvdKSVeLNqybRi0ZSQcfJsR1bv48cFJV8SYirjXb91wkrmu9XvJqqaBIfRYOLjBj/Vpk=",
        "base64"
      )
    )
    .toString()
);