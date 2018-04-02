import time
import pigpio
import vw

TX=22

BPS=128

pi = pigpio.pi() # Connect to local Pi.
tx = vw.tx(pi, TX, BPS) # Specify Pi, tx gpio, and baud.
while 1 == 1:
    while not tx.ready():
        time.sleep(0.1)
    time.sleep(0.2)
    tx.put("01001001")
    print("emit")
tx.cancel()
pi.stop()