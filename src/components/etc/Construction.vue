<template>
  <div id="contents" class="error_wrap">
    <div class="construction_box">
      <div class="const_box_inner">
        <h3 class="title">현재 서비스 점검 중 입니다.</h3>
        <p class="txt">
          보다 좋은 서비스를 제공 해 드리기 위해 <br> 현재 {{ mallName }} 서비스를 점검하고 있습니다.
        </p>
        <div class="notice">
          <dl>
            <dt>서비스 점검시간</dt>
            <dd>2017년 09월 13(수) 오전 0시 ~ 오전 6시</dd>
          </dl>
          <dl>
            <dt>서비스 점검내용</dt>
            <dd>시스템 업그레이드</dd>
          </dl>
        </div>
        <p class="txt">이용에 불편을 드려 대단히 죄송합니다.</p>
      </div>
    </div>
  </div>
</template>
<script>
import config from '@/config'

export default {
  metaInfo: {
    title: '서비스점검중'
  },
  data () {
    return {
      mallName: config.mallName
    }
  }
}
</script>
