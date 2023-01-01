# Image is a file in the tag folder
class Image < Base
  attr_reader :name
  def initialize(name)
    @name = name
  end
end
