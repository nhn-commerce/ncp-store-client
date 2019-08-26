<template>
  <div class="slider js_slider">
    <div class="frame js_frame">
      <ul class="slides js_slides">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { lory } from 'lory.js'

const loryEvents = {
  'before.lory.init': 'beforeLoryInit',
  'after.lory.init': 'afterLoryInit',
  'before.lory.slide': 'beforeLorySlide',
  'after.lory.slide': 'afterLorySlide',
  'before.lory.destroy': 'beforeLoryDestroy',
  'after.lory.destroy': 'afterLoryDestroy',
  'on.lory.resize': 'onLoryResize',
  'on.lory.touchstart': 'onLoryTouchstart',
  'on.lory.touchmove': 'onLoryTouchmove',
  'on.lory.touchend': 'onLoryTouchend'
}

export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      lory: null
    }
  },
  methods: {
    handleDotEvent (e) {
      this.$emit(loryEvents[e.type], e)
    }
  },
  mounted () {
    Object.keys(loryEvents).forEach(eventNmae => {
      this.$el.addEventListener(eventNmae, this.handleDotEvent)
    })
    this.lory = lory(this.$el, this.options)
  },
  beforeDestroy () {
    this.lory.destroy()
    Object.keys(loryEvents).forEach(eventNmae => {
      this.$el.removeEventListener(eventNmae, this.handleDotEvent)
    })
  }
}
</script>

<style lang="scss">
.slider {
  img {
    width: 100%;
  }
  .frame {
    width: 100%;
    position: relative;
    // font-size: 0;
    // line-height: 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .slides {
    margin: 0;
    padding: 0;
    width: 100%;
    display: block;
    padding: 0;
  }
  li {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  .prev,
  .next {
    position: absolute;
    top: 50%;
    margin-top: -25px;
    display: block;
    cursor: pointer;
  }
  .next {
    right: 0;
  }
  .prev {
    left: 0;
  }
  .next svg,
  .prev svg {
    width: 25px;
  }
  &.js_rewind {
    .frame li {
      margin-right: 10px;
    }
  }
}
</style>
