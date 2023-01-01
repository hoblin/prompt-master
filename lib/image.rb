# Image is a file in the tag folder
class Image
  attr_reader :name, :path
  def initialize(name, tag)
    @path = "./inspiration/#{tag.category.name}/#{tag.name}/#{name}"
    @name = name
  end

  # returns url to the first image in tag dir
  def url
    path.gsub("./", "/")
  end
end
