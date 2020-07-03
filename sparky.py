from pyspark import SparkContext
from pyspark.streaming import StreamingContext

sc = SparkContext()
ssc = StreamingContext(sc, 60)

socket_stream = ssc.socketTextStream("127.0.0.1", 5555)
