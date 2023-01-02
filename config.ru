require "rack/unreloader"
require_relative "prompt_master.rb"

use Rack::Logger

Unreloader = Rack::Unreloader.new { PromptMaster }
Unreloader.require "lib/*.rb"
Unreloader.require "prompt_master.rb"

run Unreloader
