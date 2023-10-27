import os
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkcore.auth.credentials import AccessKeyCredential
from aliyunsdkcore.auth.credentials import StsTokenCredential
from aliyunsdkfnf.request.v20190315.ReportTaskSucceededRequest import ReportTaskSucceededRequest
from urllib.parse import urlsplit, parse_qs
import csv


class kv:
    k = ""
    v = ""

    def __init__(self, k, v):
        self.k = k
        self.v = v


def handler(environ, start_response):

    context = environ['fc.context']

    dbFile = "/mnt/auto/db-"+os.environ.get('FC_SERVICE_NAME')+".csv"

    query_string = environ['QUERY_STRING']
    params = parse_qs(query_string)

    flow_name = params["flow_name"][0]

    key = f"token@@{flow_name}@@{context.account_id}"

    # ss = "SELECT v FROM read_csv('"+dbFile+"', delim=',', header=true, columns={'k': 'VARCHAR', 'v': 'VARCHAR'}) WHERE k = '"+key+"'"
    # data = duckdb.sql(ss)

    kvs = []

    with open(dbFile, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            kvs.append(kv(row[0], row[1]))

    for mkv in kvs:
        print(mkv)
        if mkv.k == key:
            data = mkv.v

    token = data

    # Please ensure that the environment variables ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are set.
    # credentials = AccessKeyCredential(os.environ['ALIBABA_CLOUD_ACCESS_KEY_ID'], os.environ['ALIBABA_CLOUD_ACCESS_KEY_SECRET'])
    # use STS Token
    credentials = StsTokenCredential(context.credentials.access_key_id,
                                     context.credentials.access_key_secret, context.credentials.security_token)
    client = AcsClient(region_id=context.region, credential=credentials)

    # 某些region，endpoint fnf.cn-qingdao.aliyuncs.com
    client.add_endpoint(context.region, 'FNF', 'http://' +
                        context.region+'.fnf.aliyuncs.com')

    request = ReportTaskSucceededRequest()
    request.set_TaskToken(token)
    request.set_Output('{"output":"ok"}')

    response = client.do_action_with_exception(request)

    # print(response)

    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    start_response(status, response_headers)
    # return value must be iterable
    return ["OK"]
