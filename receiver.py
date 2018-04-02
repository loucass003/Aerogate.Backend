import time
import pigpio
import vw
import sys

RX=27
BPS=128

pi = pigpio.pi()

if not pi.connected:
   exit(0)

rx = vw.rx(pi, RX, BPS)

while True:
   while rx.ready():
      print('{ "data": [' + ', '.join(str(e) for e in rx.get()) + '], "time": ' + str(round(time.time() * 1000)) + ' }')
   time.sleep(1)
   sys.stdout.flush()

rx.cancel()
pi.stop()
