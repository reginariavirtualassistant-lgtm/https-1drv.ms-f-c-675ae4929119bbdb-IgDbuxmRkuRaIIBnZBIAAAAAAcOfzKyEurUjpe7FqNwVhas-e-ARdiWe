/** Local fictional-issuer API client. No credentials, card numbers, or real personal data. */
export type DemoCard={id:string;program:string;status:string};
export type LinkSession={sessionId:string;state:string;program:string};
export class DemoIssuerClient {
  private token:string|null=null;
  constructor(private baseUrl:string){}
  private async request(path:string,method='GET',body?:object){
    const response=await fetch(this.baseUrl.replace(/\/$/,'')+path,{
      method,headers:{'Content-Type':'application/json',...(this.token?{Authorization:`Bearer ${this.token}`}:{})},
      ...(body!==undefined?{body:JSON.stringify(body)}:{})
    });
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'Local demo API error');
    return data;
  }
  health(){return this.request('/health')}
  async startDemo(){const data=await this.request('/v1/demo/sessions','POST',{});this.token=data.sessionToken;return data}
  listCards():Promise<{cards:DemoCard[]}>{return this.request('/v1/wallet/cards')}
  startLink(program:string):Promise<LinkSession>{return this.request('/v1/issuer/link-sessions','POST',{program})}
  approveDemoLink(session:LinkSession){return this.request('/v1/issuer/demo-approve','POST',{sessionId:session.sessionId,state:session.state,approved:true})}
  getBenefits(id:string){return this.request(`/v1/wallet/cards/${encodeURIComponent(id)}/benefits`)}
  unlink(id:string){return this.request(`/v1/wallet/cards/${encodeURIComponent(id)}`,'DELETE',{})}
  audit(){return this.request('/v1/audit/events')}
  async logout(){if(this.token)await this.request('/v1/demo/logout','POST',{});this.token=null}
}
