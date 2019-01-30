echo "=> Deploying to S3"
echo "=> Note that until we get some CI set up, @nlincoln will need to run this manually";

set -e;
rm -rf build;
yarn build
aws s3 cp build s3://drawsnell.com --recursive
