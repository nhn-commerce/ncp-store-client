<template>
  <div>
    <event-top :event="event" v-if="type === 'TOP'" />
    <event-coupons :event="event" v-else-if="type === 'COUPONS'" />
    <template v-else>
      <event-slick :event="event" :slickOptions="slickOptions" v-if="event.slickMenu && event.slickMenu.length > 0 && event.slickMenu[0].length > 1" />
      <event-section :event="event" />
    </template>
  </div>
</template>

<script>
import EventTop from '@/components/event/EventTop'
import EventCoupons from '@/components/event/EventCoupons'
import EventSlick from '@/components/event/EventSlick'
import EventSection from '@/components/event/EventSection'

export default {
  props: ['event', 'slickOptions', 'type'],
  components: {
    EventTop,
    EventCoupons,
    EventSlick,
    EventSection
  }
}
</script>
