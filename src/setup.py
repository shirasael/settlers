from setuptools import setup, find_packages

setup(
    name='settlers',
    version='0.0.1',
    description='Settlers for yafasim',
    url='https://github.com/shirasael/settlers.git',
    author='Shirasael',
    author_email='shira.asael@gmail.com',
    classifiers=[
        # How mature is this project? Common values are
        #   3 - Alpha
        #   4 - Beta
        #   5 - Production/Stable
        'Development Status :: 3 - Alpha',

        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
    ],
    packages=find_packages(),
    install_requires=['flask'],
)
