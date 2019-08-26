<template>
  <div id="layerPopup" style="position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 999999;">
    <div id="qnaWritePopBg" style="background-color:black; filter: alpha(opacity=0); -khtml-opacity:0; -moz-opacity:0; opacity:0; width:100%; height: 100%; position:fixed; left:0; top:0; ">&nbsp;</div>
    <div id="qnaWritePop" class="_layer_content _text" style="position:fixed; " data-type="text">
      <div class="basic_popup delivery_notice_popup">
        <div class="popup_wrap">
          <div class="popup_inner">
            <div class="popup_title">
              <h3>추가배송지 지역정보</h3>
            </div>
            <div class="delivery_notice">
              <p class="txt"> 본 상품을 주문하실 때 아래 표기 된 지역으로 <br> 배송하실 경우 도서산간 추가배송비가 부과됩니다. </p>
              <table>
                <thead>
                  <tr>
                    <th>지역명</th>
                    <th>추가배송비</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in addressList" :key="item.address">
                    <td>{{item.address}}</td>
                    <td>{{cmiliFormat(item.extraDeliveryAmt)}}원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button @click="closePop" type="button" class="btn_close" id="closeBtn1">팝업 닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
export default {
  props: ['addressList'],
  methods: {
    cmiliFormat (val) {
      return formatCurrency(val)
    },
    closePop () {
      this.$emit('close', false)
    }
  }
}
</script>

