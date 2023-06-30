import React,{ useRef } from 'react';
import FFmpeg from '@ffmpeg/ffmpeg';
import './index.less';



const { createFFmpeg } = FFmpeg;

const ffmpeg = createFFmpeg({
  log: true,
})

const getFile = async(url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const ret = await blob.arrayBuffer();
  return ret;
};

const Video: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleClick = async () => {
    const video = videoRef.current;
    if(!video) return;
    await ffmpeg.load();
    const inputvideo = await getFile(require('@/public/新裤子 - 你要跳舞吗.mp4'));
    const inputaudio = await getFile(require('@/public/蝴蝶.mp3'));
    const dataInputVideo = new Uint8Array(inputvideo);
    const dataInputAudio = new Uint8Array(inputaudio);

    ffmpeg.FS('writeFile','1.mp4',dataInputVideo);
    ffmpeg.FS('writeFile','2.mp3',dataInputAudio);

    await ffmpeg.run('-i','1.mp4','-i','2.mp3','-c:v','copy','-c:a','aac','-map','0:v:0','-map','1:a:0','-shortest','output.mp4');
    
    const data = ffmpeg.FS('readFile','output.mp4');
    video.src = URL.createObjectURL(new Blob([data.buffer],{ type: 'video/mp4' }));
    // video.load();
  };
  
  return (
    <div className='video' id='myvideo'>
      <video src={require('@/public/新裤子 - 你要跳舞吗.mp4')} width={1260} height={740} controls ref={videoRef}>
      </video>
      <div className='video__button-wrapper'>
        <button className='video__button' onClick={handleClick}>Click</button>
      </div>
    </div>
  );
};

export default Video;