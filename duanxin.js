let aa = { SyncOtherMachine: 2,
   From_Account: 'system-server-01',
   To_Account:
    [ 'user-yndermyy-dev-pc-15321215408',
      'user-yndermyy-dev-app-15321215408' ],
   MsgLifeTime: 604800,
   MsgRandom: 384409793,
   MsgBody: [ { MsgType: 'TIMTextElem', MsgContent: [Object] } ],
   OfflinePushInfo:
    { PushFlag: 0,
      Title: '系统消息',
      Desc: '您好! 客服人员回复了您的问题：测试测试',
      Ext:
       { uuid: 'ccbb13f5-f903-4eb7-a1bf-7f08d6aadf15',
         id: 5c458c8d957a4910f406beaa,
         chatId: 5c4581f3ecafbf5233594f16,
         direction: 'system->user',
         type: '24',
         createdAt: undefined,
         isImageUrl: false,
         name: '系统消息' },
      AndroidInfo: {},
      ApnsInfo: { BadgeMode: 0 } } }

let cc = JSON.stringify(aa)
console.log(cc);
