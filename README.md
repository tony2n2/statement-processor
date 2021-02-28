# Statement Processor

Use the following instructions to deploy the application.

# Requirements
- [Node.js 10 with npm](https://nodejs.org/en/download/releases/)
- The Bash shell. For Linux and macOS, this is included by default. In Windows 10, you can install the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to get a Windows-integrated version of Ubuntu and Bash.
- [The AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) v1.17 or newer.

If you use the AWS CLI v2, add the following to your [configuration file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) (`~/.aws/config`):

```
cli_binary_format=raw-in-base64-out
```

This setting enables the AWS CLI v2 to load JSON events from a file, matching the v1 behavior.

# Setup
To create a new bucket for deployment artifacts, run `1-create-bucket.sh`.

# Deploy
To deploy the application, run `2-deploy.sh`.

# Test
To invoke the function directly with a test event (`event.json`), run `3-invoke.sh`.
To invoke the function with the REST API, run the `4-get.sh` script. This script uses cURL to send a GET request to the API endpoint.

# Cleanup
To delete the application, run `5-cleanup.sh`.
