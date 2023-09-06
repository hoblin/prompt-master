require 'logger'

class AppLogger
  def self.log
    if @logger.nil?
      @logger = Logger.new(STDOUT)
      @logger.datetime_format = "%Y-%m-%d %H:%M:%S"
      @logger.formatter = proc do |severity, datetime, progname, msg|
        date_format = datetime.strftime(@logger.datetime_format)
        "[#{date_format}] #{severity}: #{msg}\n"
      end
    end
    @logger
  end
end
