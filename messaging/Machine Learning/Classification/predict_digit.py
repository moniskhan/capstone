"""
===========================================================
A demo of supervised learning via classification on digits dataset sklearn
===========================================================


"""
from sklearn import datasets # sklearn provided data libraries
from sklearn import svm # provides estimator class

digits = datasets.load_digits()

# estimator instance is a classifier which implements
# fit(X,y) and predict(T)
clf = svm.SVC(gamma = 0.001, C = 100.)
# train the estimator with the provided data set
clf.fit(digits.data[:-1], digits.target[:-1])
# test the estimator on the last element in the data set
print clf.predict(digits.data[-1])