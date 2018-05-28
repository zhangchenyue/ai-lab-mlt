<template>
    <div class='tutorial'>
        <video-player class='video-box' ref='videoPlayer' :options='playerOptions' :playsinline='true' ></video-player>
    </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';
const TUTORIAL_VEDIO_URL = 'http://163.184.55.31/MLT_Tutorial.mp4';

export default {
  data() {
    return {
      // component options
      playsinline: true,
      // videojs options
      playerOptions: {
        muted: false,
        autoplay: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            src: TUTORIAL_VEDIO_URL
          }
        ]
      }
    };
  },
  components: {
    videoPlayer
  }
};
</script>

<style lang='scss'>
.tutorial {
    position: relative;
    margin: 0 auto;
    height: 100%;
    background: black;
    
    .video-player.video-box{
      width: 100%;
      height: 100%;
    }

    .video-js{
        position: static;
    }

    .vjs_video_3-dimensions{
      width: 100%;
      height: 100%;
    }
}
</style>