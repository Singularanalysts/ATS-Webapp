

export function  transform(value: number): string {
    var sec_num = value;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = 0;
    }
    if (minutes < 10) {
      minutes = 0;
    }
    if (seconds < 10) {
      //seconds = 0;
    }
    return hours + 'h:' + +minutes + 'm:' + +seconds + 's';
  }





  export function pauseTimer(interval: any) {
  clearInterval(interval);
 // this.onAction('NO')
}
