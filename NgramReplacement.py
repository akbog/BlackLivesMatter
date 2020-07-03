import re
from pyspark import keyword_only  ## < 2.0 -> pyspark.ml.util.keyword_only
from pyspark.ml import Transformer
from pyspark.ml.param.shared import HasInputCol, HasOutputCol, Param, Params, TypeConverters
# Available in PySpark >= 2.3.0
from pyspark.ml.util import DefaultParamsReadable, DefaultParamsWritable
from pyspark.sql.functions import udf
from pyspark.sql.types import ArrayType, StringType

class NGramReplacer(Transformer, HasInputCol, HasOutputCol, DefaultParamsReadable, DefaultParamsWritable):

    # ngrams = Param(Params._dummy(), "ngrams", "ngrams",
    #                   typeConverter=TypeConverters.toListString)

    # ngrams = Param(Params._dummy(), "ngrams", "ngrams")


    @keyword_only
    def __init__(self, inputCols=None, outputCol=None):
        super(NGramReplacer, self).__init__()
        # self.ngrams = Param(self, "ngrams", "")
        # self._setDefault(ngrams=[])
        kwargs = self._input_kwargs
        self.setParams(**kwargs)

    @keyword_only
    def setParams(self, inputCol=None, outputCol=None, stopwords=None):
        kwargs = self._input_kwargs
        return self._set(**kwargs)

    # def setNgrams(self, value):
    #     return self._set(ngrams=value)
    #
    # def getNgrams(self):
    #     return self.getOrDefault(self.ngrams)

    def setInputCols(self, value):
        return self._set(inputCols=value)

    def setOutputCol(self, value):
        return self._set(outputCol=value)

    def _transform(self, dataset):
        ngrams = self.getNgrams()

        def f(s):
            # s = " ".join(list(s))
            # I know what's happening and it's honestly the worst!! - I should just build this udf on the outside...
            for ngram in ngrams:
                return [re.sub(ngram[0], ngram[1], " ".join(temp)) for temp in s]

        t = ArrayType(StringType())
        out_col = self.getOutputCol()
        in_col = dataset[self.getInputCol()]
        return dataset.withColumn(out_col, udf(f, t)(in_col))
