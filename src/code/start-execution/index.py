import os
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkcore.auth.credentials import AccessKeyCredential
from aliyunsdkcore.auth.credentials import StsTokenCredential
from aliyunsdkfnf.request.v20190315.StartExecutionRequest import StartExecutionRequest
from urllib.parse import urlsplit, parse_qs


def handler(environ, start_response):

    context = environ['fc.context']

    query_string = environ['QUERY_STRING']
    params = parse_qs(query_string)

    flow_name = params["flow_name"][0]

    credentials = StsTokenCredential(context.credentials.access_key_id,
                                     context.credentials.access_key_secret, context.credentials.security_token)
    client = AcsClient(region_id=context.region, credential=credentials)

    # client.add_endpoint(context.region, 'FNF', 'http://staging.cn-hangzhou.fnf.aliyuncs.com')
    client.add_endpoint(context.region, 'FNF', 'http://' +
                        context.region+'.fnf.aliyuncs.com')

    request = StartExecutionRequest()
    request.set_Input('{"key":"ok"}')
    request.set_FlowName(flow_name)

    response = client.do_action_with_exception(request)

    # print(response)

    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    start_response(status, response_headers)
    # return value must be iterable
    return ["OK"]
