# Image is a file in the tag folder
class Image < Base
  attr_reader :name, :path
  def initialize(name, tag, category)
    @path = "./inspiration/#{category}/#{tag}/#{name}"
    @name = name
  end

  # returns url to the first image in tag dir
  def url
    path.gsub("./", "/")
  end
end
