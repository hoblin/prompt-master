# base model with logger
class Base
  def logger
    @logger ||= Logger.new($stdout)
  end
end
