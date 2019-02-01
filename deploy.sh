echo "=> Deploying to S3"
echo "=> Note that until we get some CI set up, @nlincoln will need to run this manually";

set -e;
rm -rf build;
yarn build
aws s3 cp build s3://drawsnell.com --recursive

echo "=> Invalidating cloudfront caches: changes will still take a few minutes to propogate"

# You know have I ever mentioned how wild aws pricing for cache invalidation is?
# The pricing is based on _patterns_, not number of things you remove from the cache
# So the command below basically removes _everything_ in the cache, but it costs basically nothing
#  because it's only a single pattern!

aws cloudfront create-invalidation --distribution-id EAGGZPDCEA9R7 --paths '/*'
