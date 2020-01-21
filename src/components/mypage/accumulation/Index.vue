<template>
  <Accumulations>
    <template scope="scopeProp">
      <dl class="order_top">
        <dt class="save_money">{{scopeProp.accumulationConfig&&scopeProp.accumulationConfig.accumulationName}} 현황</dt>
        <dd class="pseudo_class" v-if="scopeProp.accumulationsSummary">
          <p class="num color_4b9">
            <span>{{scopeProp.accumulationsSummary.totalAvailableAmt}}</span>{{scopeProp.accumulationConfig&&scopeProp.accumulationConfig.accumulationUnit}}
          </p>
          <p class="num_txt">사용가능 {{scopeProp.accumulationConfig&&scopeProp.accumulationConfig.accumulationName}}</p>
        </dd>
        <dd v-if="scopeProp.accumulationsSummary30">
          <p class="num color_b4b">
            <span>{{scopeProp.accumulationsSummary30.totalExpireAmt}}</span>{{scopeProp.accumulationConfig&&scopeProp.accumulationConfig.accumulationUnit}}
          </p>
          <p class="num_txt">30일 내 소멸 예정</p>
        </dd>
      </dl>
      <dl class="period_query">
        <dt>기간조회</dt>
        <dd>
          <ul class="period">
            <li :class="!scopeProp.ymd.selectedOneMonth && scopeProp.ymd.selectedSomeMonth===1?'click':''">
              <a @click="scopeProp.select(1)">1개월</a>
            </li>
            <li :class="!scopeProp.ymd.selectedOneMonth && scopeProp.ymd.selectedSomeMonth===3?'click':''">
              <a @click="scopeProp.select(3)">3개월</a>
            </li>
            <li :class="!scopeProp.ymd.selectedOneMonth && scopeProp.ymd.selectedSomeMonth===6?'click':''">
              <a @click="scopeProp.select(6)">6개월</a>
            </li>
            <li :class="[scopeProp.ymd.selectedOneMonthDisplay? 'is_open':'is_close',scopeProp.ymd.selectedOneMonth?'is_selected':'']" v-click-outside="scopeProp.outside">
              <!-- Ul will appear when class is 'is_open' -->
              <a class="enquiry" @click="scopeProp.toggle()">
                <template v-if="scopeProp.ymd.selectedOneMonth && scopeProp.ymd.selectedOneMonthContent">
                  {{scopeProp.ymd.selectedOneMonthContent.year}}년 {{scopeProp.ymd.selectedOneMonthContent.month}}월
                </template>
                <template v-else>
                  월별조회
                </template>
              </a>
              <ul>
                <li v-for="ym in scopeProp.ymd.ymList">
                  <a :class="{ 'is_curr': scopeProp.ymd.selectedOneMonth && scopeProp.ymd.selectedOneMonthContent.month === ym.month}" @click="scopeProp.select(ym)">{{ym.year}}년 {{ym.month}}월</a>
                </li>
              </ul>
            </li>
          </ul>
        </dd>
      </dl>
      <dl class="order_list" v-if="scopeProp.accumulations.items.length>0">
        <dt>
          <ul>
            <li>일자</li>
            <li>내역</li>
            <li>적립/사용</li>
          </ul>
        </dt>
        <dd v-for="item in scopeProp.accumulations.items">
          <ul>
            <li>{{item.registerYmdt}}</li>
            <li v-if="scopeProp.manualList.indexOf(item.accumulationReserveReason) > -1">{{item.reasonDetail}}</li>
            <li v-else>{{item.accumulationReserveReasonDisplay}}</li>
            <li class="color_4b9" v-if="item.accumulationStatus==='GIVE_AVAILABLE'">+{{item.accumulationAmt}}{{scopeProp.accumulationConfig&&scopeProp.accumulationConfig.accumulationUnit}}</li>
            <li v-else>-{{item.accumulationAmt}}{{scopeProp.accumulationConfig&&scopeProp.accumulationConfig.accumulationUnit}}</li>
          </ul>
        </dd>
      </dl>
      <dl class="order_list" v-else>
        <dt>
          <ul>
            <li>일자</li>
            <li>내역</li>
            <li>적립/사용</li>
          </ul>
        </dt>
        <dd class="order_empty">적립 내역이 없습니다.</dd>
      </dl>

    </template>
  </Accumulations>
</template>
<script>
import Accumulations from './Accumulations'
export default {
  components: {
    Accumulations
  }
}
</script>