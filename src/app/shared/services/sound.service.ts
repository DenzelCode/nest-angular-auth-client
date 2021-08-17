import { Injectable } from '@angular/core';

export enum Sound {
  Message = 'message-tone',
}

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  constructor() {}

  playSound(sound: Sound) {
    const path = `assets/tones/${sound}.mp3`;

    if (sound) {
      const audio = new Audio(path);
      audio.muted = false;
      audio.play();
    }
  }
}
