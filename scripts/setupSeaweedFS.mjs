import {listBuckets, putBucket} from "../src/utils/weed-utils.mjs";
import {BUCKET_FULL_RES, BUCKET_LOW_RES, BUCKET_MED_RES} from "../config.mjs";

const buckets = await listBuckets()

if (!buckets.includes(BUCKET_FULL_RES)) {
    const res = await putBucket(BUCKET_FULL_RES);
    console.log(`Succeed making bucket ${BUCKET_FULL_RES}: ${res}`);
}

if (!buckets.includes(BUCKET_LOW_RES)) {
    const res = await putBucket(BUCKET_LOW_RES);
    console.log(`Succeed making bucket ${BUCKET_LOW_RES}: ${res}`);
}

if (!buckets.includes(BUCKET_MED_RES)) {
    const res =  await putBucket(BUCKET_MED_RES);
    console.log(`Succeed making bucket ${BUCKET_MED_RES}: ${res}`);
}
