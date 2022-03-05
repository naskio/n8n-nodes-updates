# n8n-nodes-updates

Split the input based on the previous execution into: new items, updated items and old items.

[![n8n](https://github.com/naskio/n8n-nodes-updates/blob/main/assets/screenshot.png?raw=true)](https://nask.io)

> This node works only in trigger mode (with Cron, Webhook, etc.), in manual mode it will return any input as new items.

# Description

This node take an input and split its items into 3 groups:

- new items: items that are not in the previous execution
- updated items: items that are in the previous execution and have changed
- old items: items that are in the previous execution and have not changed

# Use Case

Avoid processing the same items multiple times.

# Contribute

Pull requests are welcome! For any bug reports, please create
an [issue](https://github.com/naskio/n8n-nodes-updates/issues).

See the [contributing guide](./CONTRIBUTING.md) for more information.

# License

[MIT](./LICENSE)
