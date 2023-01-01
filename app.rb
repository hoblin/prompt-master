#!/usr/bin/env ruby
# encoding: utf-8

# Require all gems in Gemfile
require 'bundler'
Bundler.require

error do
  erb :'500'
end

get '/' do
  erb :index
end
